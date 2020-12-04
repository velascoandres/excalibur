import {ControllerCrudMehods, FindFullQuery, PrincipalService} from '../../..';
import {DeepPartial, ObjectLiteral} from 'typeorm';
import {Body, Delete, Get, HttpStatus, Param, Post, Put, Query} from '@nestjs/common';
import {
    ApiBadRequestResponse,
    ApiCreatedResponse,
    ApiInternalServerErrorResponse, ApiOkResponse,
    ApiUnauthorizedResponse
} from '@nestjs/swagger';
import {GenericFindResponse} from './generic-find.response';
import {ApiResponseOptions} from '@nestjs/swagger/dist/decorators/api-response.decorator';

export type Constructor = new (...args: any[]) => {};

export abstract class AbstractController<T> implements ControllerCrudMehods<T> {

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

export function CrudController<T>(options: ApiResponseOptions) {
    class BaseController extends AbstractController<T> {

        constructor(
            readonly _service: PrincipalService<T>,
        ) {
            super();
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
        @ApiOkResponse(options)
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
