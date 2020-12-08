import {BaseDTO, DtoConfig, DtoConfigInterface, FindFullQuery, PrincipalService} from '../../..';
import {DeepPartial} from 'typeorm';
import {
    BadRequestException,
    Body,
    Delete,
    Get, HttpStatus,
    InternalServerErrorException, NotFoundException,
    Param,
    Post,
    Put,
    Query, Response
} from '@nestjs/common';
import {AbstractController} from './abstract-controller';
import {validateMany} from '../../shared-utils/validate-many';
import {plainToClass} from 'class-transformer';
import {validate} from 'class-validator';


export function CrudController<T>(dtoConfig: DtoConfigInterface | DtoConfig): typeof AbstractController {
    class BaseController extends AbstractController<T> {

        constructor(
            readonly _service: PrincipalService<T>,
        ) {
            super(_service);
        }

        @Post('bulk')
        async createMany(
            @Body('records') newRecords: DeepPartial<T>[]): Promise<T[]> {
            const validationErrors = await validateMany(newRecords, dtoConfig.createDtoType);
            if (validationErrors.length > 0) {
                console.error(validationErrors);
                throw new BadRequestException('Bad Request');
            } else {
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
                    throw new InternalServerErrorException('Server Error');
                }
            }
        }

        @Post()
        async createOne(
            @Body() newRecord: DeepPartial<T>, @Response() response: any,
        ){
            const entityDto = plainToClass(dtoConfig.createDtoType, newRecord) as object;
            const validationErrors = await validate(entityDto);
            if (validationErrors.length > 0) {
                console.error(validationErrors);
                response.status(HttpStatus.BAD_REQUEST).send({ message: 'Bad Request' });
            } else {
                try {
                    const recordCreated =  this._service.createOne(newRecord);
                    response.status(HttpStatus.OK).send(recordCreated);
                } catch (error) {
                    console.error(
                        {
                            error,
                            message: 'Error on create',
                            data: {record: newRecord},
                        }
                    );
                    response.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: 'Server Error' });
                }
            }
        }

        @Delete(':id')
        async deleteOne(
            @Param('id') id: number,
        ): Promise<T> {
            const isIdValid = this.validateId(id);
            if (isIdValid) {
                try {
                    await this._service.findOneById(id);
                } catch (error) {
                    throw new NotFoundException({message: 'Record not found'});
                }
                try {
                    return await this._service.deleteOne(id);
                } catch (error) {
                    console.error(
                        {
                            error,
                            message: 'Error on delete',
                            data: {id},
                        },
                    );
                    throw new InternalServerErrorException({message: 'Server Error'});
                }
            } else {
                throw new BadRequestException({message: 'Invalid Id'});
            }
        }

        @Get()
        async findAll(
            @Query('query') searchCriteria: any,
        ): Promise<{ nextQuery: any; data: T[]; total: number }> {
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
                return {
                    nextQuery,
                    data,
                    total: totalRecords,
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
        async findOneById(
            @Param('id') id: number,
        ): Promise<T> {
            const isIdValid = this.validateId(id);
            if (isIdValid) {
                try {
                    return this._service.findOneById(Number(id),);
                } catch (error) {
                    console.error(
                        {
                            error,
                            mensaje: 'Error on fetch results',
                            data: {id},
                        },
                    );
                    throw new InternalServerErrorException({message: 'Server Error'});
                }
            } else {
                throw new BadRequestException({message: 'Invalid Id'});
            }
        }

        @Put(':id')
        async updateOne(
            @Body() recordToUpdate: DeepPartial<T>,
            @Param('id') id: number,
        ): Promise<T> {
            const isValidId = this.validateId(id);
            if (isValidId) {
                const dtoEntity = plainToClass(dtoConfig.updateDtoType, recordToUpdate) as object;
                const validationErrors = await validate(dtoEntity);
                if (validationErrors.length > 0) {
                    console.error(validationErrors);
                    throw new BadRequestException({message: 'Bad Request'});
                } else {
                    try {
                        await this._service.findOneById(id);
                    } catch (error) {
                        throw new NotFoundException({message: 'Record not found'});
                    }
                    try {
                        return this._service.updateOne(id, recordToUpdate);
                    } catch (error) {
                        console.error(
                            {
                                error,
                                message: 'Error al actualizar',
                                data: {id, datosActualizar: recordToUpdate},
                            }
                        );
                        throw new InternalServerErrorException({message: 'Server Error'});
                    }

                }
            } else {
                throw new BadRequestException({message: 'Invalid Id'});
            }
        }

        protected validateId(id: any): boolean {
            return !isNaN(Number(id));
        }
    }

    return BaseController as any;
}
