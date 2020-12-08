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

        @Post('create-many')
        async createMany(
            @Body('records') newRecords: DeepPartial<T>[],
            @Response() response: any,
        ) {
            const validationErrors = await validateMany(newRecords, dtoConfig.createDtoType);
            if (validationErrors.length > 0) {
                console.error(validationErrors);
                response.status(HttpStatus.BAD_REQUEST).send({message: 'Bad Request'});
            } else {
                try {
                    const createdRows = await this._service.createMany(newRecords);
                    response.status(HttpStatus.OK).send(createdRows);

                } catch (error) {
                    console.error(
                        {
                            error,
                            message: 'Error on create',
                            data: {records: newRecords},
                        }
                    );
                    response.status(HttpStatus.INTERNAL_SERVER_ERROR).send({message: 'Server Error'});
                }
            }
        }

        @Post()
        async createOne(
            @Body() newRecord: DeepPartial<T>,
            @Response() response: any,
        ) {
            const entityDto = plainToClass(dtoConfig.createDtoType, newRecord) as object;
            const validationErrors = await validate(entityDto);
            if (validationErrors.length > 0) {
                console.error(validationErrors);
                response.status(HttpStatus.BAD_REQUEST).send({message: 'Bad Request'});
            } else {
                try {
                    const recordCreated = await this._service.createOne(newRecord);
                    response.status(HttpStatus.OK).send(recordCreated);
                } catch (error) {
                    console.error(
                        {
                            error,
                            message: 'Error on create',
                            data: {record: newRecord},
                        }
                    );
                    response.status(HttpStatus.INTERNAL_SERVER_ERROR).send({message: 'Server Error'});
                }
            }
        }

        @Delete(':id')
        async deleteOne(
            @Param('id') id: number,
            @Response() response: any,
        ) {
            const isIdValid = this.validateId(id);
            if (isIdValid) {
                try {
                    await this._service.findOneById(id);
                } catch (error) {
                    response.status(HttpStatus.NOT_FOUND).send({message: 'Record not found'});
                }
                try {
                    const deletedRecord = await this._service.deleteOne(id);
                    response.status(HttpStatus.OK).send(deletedRecord);
                } catch (error) {
                    console.error(
                        {
                            error,
                            message: 'Error on delete',
                            data: {id},
                        },
                    );
                    response.status(HttpStatus.INTERNAL_SERVER_ERROR).send({message: 'Server Error'});
                }
            } else {
                response.status(HttpStatus.BAD_REQUEST).send({message: 'Invalid Id'});
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
                const defaultQueryResponse =  {
                    nextQuery: {skip: 10, take},
                    data: result[0],
                    total: result[1],
                };
                response.status(HttpStatus.OK).json(defaultQueryResponse);
            }
        }

        @Get(':id')
        async findOneById(
            @Param('id') id: number,
            @Response() response: any,
        ) {
            const isIdValid = this.validateId(id);
            if (isIdValid) {
                try {
                    const fetchedRow = await this._service.findOneById(Number(id),);
                    response.status(HttpStatus.OK).send(fetchedRow);
                } catch (error) {
                    console.error(
                        {
                            error,
                            mensaje: 'Error on fetch results',
                            data: {id},
                        },
                    );
                    response.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: 'Server Error' });
                }
            } else {
                response.status(HttpStatus.BAD_REQUEST).send({ message: 'Invalid Id' });
            }
        }

        @Put(':id')
        async updateOne(
            @Body() recordToUpdate: DeepPartial<T>,
            @Param('id') id: number,
            @Response() response: any,
        ) {
            const isValidId = this.validateId(id);
            if (isValidId) {
                const dtoEntity = plainToClass(dtoConfig.updateDtoType, recordToUpdate) as object;
                const validationErrors = await validate(dtoEntity);
                if (validationErrors.length > 0) {
                    console.error(validationErrors);
                    response.status(HttpStatus.BAD_REQUEST).send({ message: 'Bad Request' });
                } else {
                    try {
                        await this._service.findOneById(id);
                    } catch (error) {
                        response.status(HttpStatus.NOT_FOUND).send({ message: 'Record not found' });
                    }
                    try {
                        const updatedRow =  await this._service.updateOne(id, recordToUpdate);
                        response.status(HttpStatus.OK).send(updatedRow);
                    } catch (error) {
                        console.error(
                            {
                                error,
                                message: 'Error al actualizar',
                                data: {id, datosActualizar: recordToUpdate},
                            }
                        );
                        response.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: 'Server Error' });
                    }

                }
            } else {
                response.status(HttpStatus.BAD_REQUEST).send({ message: 'Invalid Id' });
            }
        }

        protected validateId(id: any): boolean {
            return !isNaN(Number(id));
        }
    }

    return BaseController as any;
}
