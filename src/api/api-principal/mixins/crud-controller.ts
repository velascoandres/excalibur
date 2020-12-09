import {DtoConfig, DtoConfigInterface, FindFullQuery, PrincipalService} from '../../..';
import {DeepPartial} from 'typeorm';
import {
    Body,
    Delete,
    Get, HttpStatus,
    InternalServerErrorException, NotFoundException,
    Param,
    Post,
    Put,
    Query, Response, UsePipes
} from '@nestjs/common';
import {AbstractController} from './abstract-controller';
import {DefaultValidationPipe} from '../pipes/default-validation.pipe';
import {PipeTransform} from '@nestjs/common/interfaces';
import {CrudMethod} from '../../decorators/crud-doc/interfaces';
import {DefaultMongoParamDto} from '../schemas/default-mongo-param-dto';
import {DefaultParamDto} from '../schemas/default-param-dto';


export interface CrudMethodPipes {
    overrideDefault?: boolean;
    pipes: (PipeTransform | Function)[];
}

export interface CrudOptions {
    useMongo?: boolean;
    dtoConfig: DtoConfigInterface | DtoConfig;
    pipesConfig?: Partial<Record<CrudMethod, CrudMethodPipes>>;
}


export function getPipesFromConfig(
    options: CrudOptions,
    methodName: CrudMethod,
    dto: any,
    mixWith: (PipeTransform | Function)[] = []
): (PipeTransform | Function)[] {
    let methodPipes: (PipeTransform | Function)[] = [
        ...mixWith,
        new DefaultValidationPipe(dto)
    ];
    if (options.pipesConfig?.[methodName]?.pipes) {
        const pipeConfig = options.pipesConfig[methodName];
        const pipes = pipeConfig!.pipes;
        if (pipeConfig?.overrideDefault) {
            methodPipes = pipes;
        } else {
            methodPipes = [
                ...methodPipes,
                ...pipes,
            ];
        }
    }
    return methodPipes;
}


export function CrudController<T>(options: CrudOptions): typeof AbstractController {

    const createDto = options.dtoConfig.createDtoType;
    const updateDto = options.dtoConfig.updateDtoType;
    const idParamDto = options.useMongo ? DefaultMongoParamDto : DefaultParamDto;

    const createOnePipes = getPipesFromConfig(options, 'createOne', createDto);
    const findOnePipes = getPipesFromConfig(options, 'findOneById', idParamDto);
    const updateOnePipes = getPipesFromConfig(options, 'updateOne', updateDto);
    const createManyPipes = getPipesFromConfig(options, 'createMany', createDto);
    const deleteOnePipes = getPipesFromConfig(options, 'deleteOne', idParamDto);


    class BaseController extends AbstractController<T> {

        constructor(
            readonly _service: PrincipalService<T>,
        ) {
            super(_service);
        }

        @Post('create-many')
        @UsePipes(...createManyPipes)
        async createMany(
            @Body() newRecords: DeepPartial<T>[],
        ) {
            try {
                return this._service.createMany(newRecords);
            } catch (error) {
                console.error(
                    {
                        error,
                        message: 'Error on create',
                        data: {records: newRecords},
                    }
                );
                throw new InternalServerErrorException({message: 'Server Error'});
            }
        }

        @Post()
        @UsePipes(...createOnePipes)
        async createOne(
            @Body() newRecord: DeepPartial<T>,
        ) {
            try {
                return this._service.createOne(newRecord);
            } catch (error) {
                console.error(
                    {
                        error,
                        message: 'Error on create',
                        data: {record: newRecord},
                    }
                );
                throw new InternalServerErrorException({message: 'Server Error'});
            }
        }

        @Delete(':id')
        async deleteOne(
            @Param(...deleteOnePipes as PipeTransform[]) params: any,
        ) {
            try {
                await this._service.findOneById(params.id);
            } catch (error) {
                throw new NotFoundException({message: 'Record not found'});
            }
            try {
                return this._service.deleteOne(params.id);
            } catch (error) {
                console.error(
                    {
                        error,
                        message: 'Error on delete',
                        data: params.id,
                    },
                );
                throw new InternalServerErrorException({message: 'Server Error'});
            }

        }

        @Get()
        async findAll(
            @Query('query') searchCriteria: any,
            @Response() response: any,
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
                const totalRecords: number = +result[1];
                const data: T[] = result[0];
                const restingRecords: number = totalRecords - (skip + take);
                const isLastPage: boolean = restingRecords <= 0;
                let nextQuery: any = null;
                if (!isLastPage) {
                    const isNotLimit = restingRecords >= take;
                    const nextSkip = skip + take;
                    const nextTake = isNotLimit ? take : restingRecords;
                    const partialQuery: Partial<FindFullQuery> = {...query};
                    partialQuery.skip = nextSkip;
                    partialQuery.take = nextTake;
                    if (query.where) {
                        const hasWhereConditions = Object.keys(query.where).length;
                        partialQuery.where = hasWhereConditions > 0 ? partialQuery.where : undefined;
                    }
                    nextQuery = partialQuery;
                }
                const queryResponse = {
                    nextQuery,
                    data,
                    total: totalRecords,
                };
                response.setHeader('Content-Type', 'application/json');
                response.status(HttpStatus.OK).json(queryResponse);
            } catch (error) {
                console.error(
                    {
                        error,
                        message: 'Incorrect query params, bringing default query!',
                        data: searchCriteria,
                    },
                );
                result = await this._service.findAll();
                const defaultQueryResponse = {
                    nextQuery: {skip: 10, take},
                    data: result[0],
                    total: result[1],
                };
                response.status(HttpStatus.OK).json(defaultQueryResponse);
            }
        }

        @Get(':id')
        async findOneById(
            @Param(...findOnePipes as PipeTransform[]) params: any,
        ) {
            try {
                return this._service.findOneById(Number(params.id),);
            } catch (error) {
                console.error(
                    {
                        error,
                        mensaje: 'Error on fetch results',
                        data: {id: params.id},
                    },
                );
                throw new NotFoundException({message: 'Record not found'});
            }
        }

        @Put(':id')
        async updateOne(
            @Body(...updateOnePipes as PipeTransform[]) recordToUpdate: DeepPartial<T>,
            @Param(...findOnePipes as PipeTransform[]) params: any,
        ) {
            try {
                await this._service.findOneById(params.id);
            } catch (error) {
                throw new NotFoundException({message: 'Record not found'});
            }
            try {
                return await this._service.updateOne(params.id, recordToUpdate);
            } catch (error) {
                console.error(
                    {
                        error,
                        message: 'Error al actualizar',
                        data: {id: params, datosActualizar: recordToUpdate},
                    }
                );
                throw new InternalServerErrorException({message: 'Server Error'});
            }
        }
    }

    return BaseController as any;
}
