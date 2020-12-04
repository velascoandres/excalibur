import { ControllerCrudMehods, CrudApiDocConfig, FindFullQuery, PrincipalService } from '../../..';
import { DeepPartial, ObjectLiteral } from 'typeorm';
import { Body, Delete, Get, HttpStatus, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import {
    ApiBadRequestResponse,
    ApiCreatedResponse,
    ApiInternalServerErrorResponse, ApiOkResponse,
    ApiUnauthorizedResponse
} from '@nestjs/swagger';
import { GenericFindResponse } from './generic-find.response';
import { ApiResponseOptions } from '@nestjs/swagger/dist/decorators/api-response.decorator';
import { CrudConfig } from '../../decorators/crud-api/interfaces/interfaces-types';
import { CanActivate } from '@nestjs/common/interfaces/features/can-activate.interface';
import { DefaultGuard } from '../guards/default.guard';


export type Constructor = new (...args: any[]) => {};

export abstract class AbstractController<T = any> implements ControllerCrudMehods<T> {

    constructor(
        readonly _service: PrincipalService<T>,
    ) {
    }

    createMany(newRecords: DeepPartial<T>[]
    ): any {
    }

    createOne(newRecord: DeepPartial<T>): any {
    }

    deleteOne(id: number): any {
    }

    findAll(searchCriteria: ObjectLiteral): any {
    }

    findOneById(id: number): any {
    }

    updateOne(recordToUpdate: DeepPartial<T>, id: number): any {
    }
}

export function CrudController<T>(options: CrudConfig): typeof AbstractController {



    // Guards
    const createOneGuards = options?.createOne?.guards ? options.createOne.guards : [new DefaultGuard()];
    const deleteOneGuards = options?.deleteOne?.guards ? options.deleteOne.guards : [new DefaultGuard()];
    const updateOneGuards = options?.updateOne?.guards ? options.updateOne.guards : [new DefaultGuard()];
    const createManyGuards = options?.createMany?.guards ? options.createMany.guards : [new DefaultGuard()];
    const findOneByIdGuards = options?.findOneById?.guards ? options.findOneById.guards : [new DefaultGuard()];
    const findAll = options?.findAll?.guards ? options.findAll.guards : [new DefaultGuard()];

    class BaseController extends AbstractController<T> {

        constructor(
            readonly _service: PrincipalService<T>,
        ) {
            super(_service);
        }

        @Post()
        @UseGuards(
            ...createManyGuards,
        )
        createMany(
            @Body('records') newRecords: DeepPartial<T>[]): any {
            return this._service.createMany(newRecords);
        }

        @Post()
        @UseGuards(
            ...createOneGuards
        )
        createOne(
            @Body() newRecord: DeepPartial<T>): any {
            return this._service.createOne(newRecord);
        }

        @Delete(':id')
        @UseGuards(
            ...deleteOneGuards
        )
        deleteOne(
            @Param('id') id: number,
        ): any {
            return this._service.deleteOne(id);
        }

        @Get()
        @UseGuards(
            ...findAll,
        )
        @ApiOkResponse()
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
                    query = { where: {}, skip: 0, take: 10 };
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
                    const partialQuery: Partial<FindFullQuery> = { ...query };
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
                    nextQuery: { skip: 10, take },
                    data: result[0],
                    total: result[1],
                };
            }
        }

        @Get(':id')
        @UseGuards(
            ...findOneByIdGuards
        )
        findOneById(
            @Param('id') id: number,
        ): any {
            return this._service.findOneById(id);
        }

        @Put(':id')
        @UseGuards(
            ...updateOneGuards
        )
        updateOne(
            @Body() recordToUpdate: DeepPartial<T>,
            @Param('id') id: number
        ): any {
            return this._service.updateOne(id, recordToUpdate);
        }
    }

    return BaseController as any;
}