import {FindFullQuery, PrincipalService} from '../../..';
import {DeepPartial} from 'typeorm';
import {Body, Delete, Get, Param, Post, Put, Query} from '@nestjs/common';
import {AbstractController} from './abstract-controller';


export function CrudController<T>(): typeof AbstractController {
    class BaseController extends AbstractController<T> {

        constructor(
            readonly _service: PrincipalService<T>,
        ) {
            super(_service);
        }

        @Post()
        createMany(
            @Body('records') newRecords: DeepPartial<T>[]): any {
            return this._service.createMany(newRecords);
        }

        @Post()
        createOne(
            @Body() newRecord: DeepPartial<T>): any {
            return this._service.createOne(newRecord);
        }

        @Delete(':id')
        deleteOne(
            @Param('id') id: number,
        ): any {
            return this._service.deleteOne(id);
        }

        @Get()
        async findAll(
            @Query('query') searchCriteria: any,
        ) {
            let result: [T[], number];
            let skip = 0;
            let take = 10;
            try {
                let query: FindFullQuery;
                if (searchCriteria) {
                    query = JSON.parse(searchCriteria);
                    result = await this._service.findAll(query);
                    skip = query.skip ? query.skip : 0;
                    take = query.take ? query.take : 10;
                } else {
                    query = {where: {}, skip: 0, take: 10};
                    result = await this._service.findAll({} as FindFullQuery);
                }
                const total = +result[1];
                const rest = total - (skip + take);
                const isLastPage = rest <= 0;
                let nextQuery = null;
                if (!isLastPage) {
                    const isNotLimit = rest >= take;
                    const nextSkip = skip + take;
                    const nextTake = isNotLimit ? take : rest;
                    const partialQuery: Partial<FindFullQuery> = {...query};
                    partialQuery.skip = nextSkip;
                    partialQuery.take = nextTake;
                    if (query.where) {
                        partialQuery.where = Object.keys(query.where).length > 0 ? partialQuery.where : undefined;
                    }
                    nextQuery = partialQuery;
                }
                return {
                    nextQuery,
                    data: result[0],
                    total: result[1],
                };
            } catch (error) {
                console.error(
                    {
                        error,
                        message: 'Incorrect query params, bringing default query!',
                        data: searchCriteria,
                    },
                );
                result = await this._service.findAll();
                return {
                    nextQuery: {skip: 10, take},
                    data: result[0],
                    total: result[1],
                };
            }
        }

        @Get(':id')
        findOneById(
            @Param('id') id: number,
        ): any {
            return this._service.findOneById(id);
        }

        @Put(':id')
        updateOne(
            @Body() recordToUpdate: DeepPartial<T>,
            @Param('id') id: number
        ): any {
            return this._service.updateOne(id, recordToUpdate);
        }
    }

    return BaseController as any;
}
