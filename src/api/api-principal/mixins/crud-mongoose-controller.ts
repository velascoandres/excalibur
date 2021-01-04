import {AbstractMongooseController} from './abstract-controller';
import {DefaultMongoParamDto} from '../schemas/default-mongo-param-dto';
import {Body, Delete, Get, Param, Post, Put, Query, UseFilters, UsePipes} from '@nestjs/common';
import {CrudFilterException} from '../exceptions/crud-exception.filter';
import {DeepPartial} from 'typeorm';
import {PipeTransform} from '@nestjs/common/interfaces';
import {LoggerService} from '../services/logger.service';
import {getPipesFromConfig, MongooseCrudOptions} from './crud-controller';
import {Document, FilterQuery} from 'mongoose';
import {AbstractMongooseService} from '../services/abstract-mongoose.service';

export function CrudMongooseController<T extends Document>(options: MongooseCrudOptions): typeof AbstractMongooseController {


    const idProperty = options.mapIdWith ? options.mapIdWith : 'id';

    const createDto = options.dtoConfig.createDtoType;
    const updateDto = options.dtoConfig.updateDtoType;
    const idParamDto = DefaultMongoParamDto;

    const debug: boolean = !!options.enableErrorMessages;

    const createOnePipes = getPipesFromConfig(
        {
            options,
            methodName: 'createOne',
            dto: createDto,
            isId: false,
            enableErrorMessages: debug
        }
    );
    const findOnePipes = getPipesFromConfig(
        {
            options,
            methodName: 'findOneById',
            dto: idParamDto,
            isId: true,
            enableErrorMessages: debug
        }
    );
    const updateOnePipes = getPipesFromConfig(
        {
            options,
            methodName: 'updateOne',
            dto: updateDto,
            isId: false,
            enableErrorMessages: debug
        }
    );
    const createManyPipes = getPipesFromConfig(
        {
            options,
            methodName: 'createMany',
            dto: createDto,
            isId: false,
            enableErrorMessages: debug
        }
    );
    const deleteOnePipes = getPipesFromConfig(
        {
            options,
            methodName: 'deleteOne',
            dto: idParamDto,
            isId: true,
            enableErrorMessages: debug
        }
    );

    class BaseController extends AbstractMongooseController<T> {

        constructor(
            readonly _service: AbstractMongooseService<T>,
        ) {
            super(_service);
        }

        /*
        @Post('create-many')
        @UseFilters(new CrudFilterException(debug))
        @UsePipes(...createManyPipes)
        createMany(
            @Body() newRecords: Partial<T>[],
        ) {
            return this._service.createMany(newRecords);
        }

        */

        @Post()
        @UseFilters(new CrudFilterException(debug))
        @UsePipes(...createOnePipes)
        createOne(
            @Body() newRecord: Partial<T>,
        ) {
            return this._service.createOne(newRecord);
        }

        @Delete(`:${idProperty}`)
        @UseFilters(new CrudFilterException(debug))
        async deleteOne(
            @Param(...deleteOnePipes as PipeTransform[]) params: any,
        ) {
            await this._service.findOneById(params[idProperty]);
            return this._service.deleteOne(params.id);
        }

        @Get()
        @UseFilters(new CrudFilterException(debug))
        async findAll(
            @Query('query') searchCriteria: any,
        ) {
            let result: [T[], number];
            let skip = 0;
            let take = 10;
            try {
                let query: FilterQuery<any>;
                if (searchCriteria) {
                    query = JSON.parse(searchCriteria);
                    skip = query.skip ? query.skip : 0;
                    take = query.take ? query.take : 10;

                    result = await this._service.findAll({
                        ...query.where,
                    }, null, {sort: {_id: -1}, limit: take, skip});
                } else {
                    query = {where: {}, skip: 0, take: 10};
                    result = await this._service.findAll({}, null,{sort: {_id: -1}, limit: take, skip});
                }
                const totalRecords: number = +result[1];
                const data: T[] = result[0];
                const restingRecords: number = totalRecords - (skip + take);
                const isLastPage: boolean = restingRecords <= 0;
                let nextQuery: any = null;
                if (!isLastPage) {
                    const isNotLimit = restingRecords >= take;
                    const nextSkip = skip + take;
                    const nextTake = isNotLimit ? take : restingRecords;
                    const partialQuery: Partial<FilterQuery<any>> = {...query};
                    partialQuery.skip = nextSkip;
                    partialQuery.take = nextTake;
                    if (query.where) {
                        const hasWhereConditions = Object.keys(query.where).length;
                        partialQuery.where = hasWhereConditions > 0 ? partialQuery.where : undefined;
                    }
                    nextQuery = partialQuery;
                }
                return {
                    nextQuery,
                    data,
                    total: totalRecords,
                };
            } catch (error) {
                const logger = LoggerService.getInstance().logger;
                logger.warn(
                    'Incorrect query params, bringing default query!',
                    this.constructor.name,
                );
                result = await this._service.findAll(
                    {},
                    null,
                    {sort: {_id: -1}, limit: take, skip},
                );
                return {
                    nextQuery: {skip: 10, take},
                    data: result[0],
                    total: result[1],
                };
            }
        }

        @Get(`:${idProperty}`)
        @UseFilters(new CrudFilterException(debug))
        findOneById(
            @Param(...findOnePipes as PipeTransform[]) params: any,
        ) {
            return this._service.findOneById(params[idProperty]);
        }

        @Put(`:${idProperty}`)
        @UseFilters(new CrudFilterException(debug))
        async updateOne(
            @Param(...findOnePipes as PipeTransform[]) params: any,
            @Body(...updateOnePipes as PipeTransform[]) recordToUpdate: DeepPartial<T>,
        ) {
            await this._service.findOneById(params[idProperty]);
            return await this._service.updateOne(params[idProperty], recordToUpdate);
        }
    }

    return BaseController as any;
}
