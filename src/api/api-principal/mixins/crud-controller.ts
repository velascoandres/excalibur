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

export type PipesConfig = Partial<Record<CrudMethod, CrudMethodPipes>>;

export interface CrudOptions {
    useMongo?: boolean;
    dtoConfig: DtoConfigInterface | DtoConfig;
    pipesConfig?: PipesConfig;
    enableErrorMessages?: boolean;
    mapIdWith?: string;
}

export interface PipesFromConfigOptions {
    options: CrudOptions;
    methodName: CrudMethod;
    dto: any;
    isId: boolean;
    enableErrorMessages: boolean;
}


export function getPipesFromConfig(
    pipesFromConfigOptions: PipesFromConfigOptions
): (PipeTransform | Function)[] {
    let methodPipes: (PipeTransform | Function)[] = [
        new DefaultValidationPipe(
            pipesFromConfigOptions.dto,
            pipesFromConfigOptions.enableErrorMessages,
            pipesFromConfigOptions.isId,
        ),
    ];
    if (pipesFromConfigOptions.options.pipesConfig?.[pipesFromConfigOptions.methodName]?.pipes) {

        const pipeConfigObjet: Partial<Record<CrudMethod, CrudMethodPipes>> = pipesFromConfigOptions.options.pipesConfig;
        const methodName: CrudMethod = pipesFromConfigOptions.methodName;
        const pipeConfig = pipeConfigObjet[methodName];
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


    const idProperty = options.mapIdWith ? options.mapIdWith : 'id';

    const createDto = options.dtoConfig.createDtoType;
    const updateDto = options.dtoConfig.updateDtoType;
    const idParamDto = options.useMongo ? DefaultMongoParamDto : DefaultParamDto;

    const disableErrorMessages: boolean = !!options.enableErrorMessages;

    const createOnePipes = getPipesFromConfig(
        {
            options,
            methodName: 'createOne',
            dto: createDto,
            isId: false,
            enableErrorMessages: disableErrorMessages
        }
    );
    const findOnePipes = getPipesFromConfig(
        {
            options,
            methodName: 'findOneById',
            dto: idParamDto,
            isId: true,
            enableErrorMessages: disableErrorMessages
        }
    );
    const updateOnePipes = getPipesFromConfig(
        {
            options,
            methodName: 'updateOne',
            dto: updateDto,
            isId: false,
            enableErrorMessages: disableErrorMessages
        }
    );
    const createManyPipes = getPipesFromConfig(
        {
            options,
            methodName: 'createMany',
            dto: createDto,
            isId: false,
            enableErrorMessages: disableErrorMessages
        }
    );
    const deleteOnePipes = getPipesFromConfig(
        {
            options,
            methodName: 'deleteOne',
            dto: idParamDto,
            isId: true,
            enableErrorMessages: disableErrorMessages
        }
    );


    class BaseController extends AbstractController<T> {

        constructor(
            readonly _service: PrincipalService<T>,
        ) {
            super(_service);
        }

        @Post('create-many')
        @UsePipes(...createManyPipes)
        createMany(
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
        createOne(
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

        @Delete(`:${idProperty}`)
        async deleteOne(
            @Param(...deleteOnePipes as PipeTransform[]) params: any,
        ) {
            try {
                await this._service.findOneById(params[idProperty]);
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
                        data: params[idProperty],
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

        @Get(`:${idProperty}`)
        findOneById(
            @Param(...findOnePipes as PipeTransform[]) params: any,
        ) {
            try {
                return this._service.findOneById(params[idProperty]);
            } catch (error) {
                console.error(
                    {
                        error,
                        mensaje: 'Error on fetch rows',
                        data: {[`${idProperty}`]: params[idProperty]},
                    },
                );
                throw new NotFoundException({message: 'Record not found'});
            }
        }

        @Put(`:${idProperty}`)
        async updateOne(
            @Param(...findOnePipes as PipeTransform[]) params: any,
            @Body(...updateOnePipes as PipeTransform[]) recordToUpdate: DeepPartial<T>,
        ) {
            try {
                await this._service.findOneById(params[idProperty]);
            } catch (error) {
                throw new NotFoundException({message: 'Record not found'});
            }
            try {
                return await this._service.updateOne(params[idProperty], recordToUpdate);
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
