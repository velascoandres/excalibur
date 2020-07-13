import {
    Body,
    Delete,
    Get,
    HttpStatus,
    Param,
    Post,
    Put,
    Query,
    Request,
    Response,
} from '@nestjs/common';
import {AbstractService, DtoConfig} from '../../..';
import {validate} from 'class-validator';
import 'reflect-metadata';
import 'es6-shim';
import {plainToClass} from 'class-transformer';
import {PrincipalAuthCrudValidation} from '../../..';
import {AuthCrudGeneric} from '../auth/auth.crud.generic';
import {BaseDTO} from '../../..';
import {
    ApiBadRequestResponse,
    ApiCreatedResponse,
    ApiInternalServerErrorResponse, ApiOkResponse,
    ApiUnauthorizedResponse
} from '@nestjs/swagger';
import {FindFullQuery} from '../../..';
import {GenericFindResponse} from './generic-find.response';
import {ControllerCrudMehods, DtoConfigInterface} from '../../..';
import {DeepPartial} from 'typeorm';

export abstract class ApiController<Entidad = any> implements ControllerCrudMehods<Entidad> {
    protected constructor(
        private readonly _principalService: AbstractService<Entidad>,
        private readonly _dtoConfig: DtoConfigInterface | DtoConfig = {createDtoType: BaseDTO, updateDtoType: BaseDTO},
        private readonly _authSecurityCrud: PrincipalAuthCrudValidation = new AuthCrudGeneric(),
    ) {
    }

    @Post()
    @ApiCreatedResponse({status: HttpStatus.OK, description: 'The record has been successfully created.'})
    @ApiUnauthorizedResponse({status: HttpStatus.UNAUTHORIZED, description: 'Not authorized'})
    @ApiBadRequestResponse({status: HttpStatus.BAD_REQUEST, description: 'Bad Request'})
    @ApiInternalServerErrorResponse({status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Server Error.'})
    async createOne(
        @Body() newRecord: DeepPartial<Entidad>,
        @Request() req: any,
        @Response() response: any,
    ) {
        const canDoAction: boolean = this._authSecurityCrud.createOneAuht(req, response, this);
        if (canDoAction) {
            const entityDto = plainToClass(this._dtoConfig.createDtoType, newRecord) as object;
            const validationErrors = await validate(entityDto);
            if (validationErrors.length > 0) {
                console.error(validationErrors);
                response.status(HttpStatus.BAD_REQUEST).send({message: 'Bad Request'});
            } else {
                try {
                    const recordCreated = await this._principalService.createOne(newRecord);
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
        } else {
            response.status(HttpStatus.UNAUTHORIZED).send({message: 'Not authorized'});
        }

    }

    @Put(':id')
    @ApiOkResponse({status: HttpStatus.OK, description: 'The record has been successfully updated.'})
    @ApiUnauthorizedResponse({status: HttpStatus.UNAUTHORIZED, description: 'Not authorized'})
    @ApiBadRequestResponse({status: HttpStatus.BAD_REQUEST, description: 'Bad Request'})
    @ApiInternalServerErrorResponse({status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Server Error.'})
    async updateOne(
        @Body() recordToUpdate: DeepPartial<Entidad>,
        @Param('id') id: number,
        @Request() req: any,
        @Response() response: any,
    ) {
        const canDoAction: boolean = this._authSecurityCrud.updateOneAuht(req, response, this);
        if (canDoAction) {
            const isValidId = !isNaN(Number(id));
            if (isValidId) {
                const dtoEntity = plainToClass(this._dtoConfig.updateDtoType, recordToUpdate) as object;
                const validationErrors = await validate(dtoEntity);
                if (validationErrors.length > 0) {
                    console.error(validationErrors);
                    response.status(HttpStatus.BAD_REQUEST).send({message: 'Bad Request'});
                } else {
                    try {
                        const recordUpdated = await this._principalService.updateOne(
                            Number(id),
                            recordToUpdate,
                        );
                        response.status(HttpStatus.OK).send(recordUpdated);
                    } catch (error) {
                        console.error(
                            {
                                error,
                                message: 'Error al actualizar',
                                data: {id, datosActualizar: recordToUpdate},
                            }
                        );
                        response.status(HttpStatus.INTERNAL_SERVER_ERROR).send({message: 'Server Error'});
                    }
                }
            } else {
                response.status(HttpStatus.BAD_REQUEST).send({message: 'Invalid Id'});
            }
        } else {
            response.status(HttpStatus.UNAUTHORIZED).send({message: 'Not authorized'});
        }
    }

    @Delete(':id')
    @ApiOkResponse({status: HttpStatus.OK, description: 'The record has been deleted.'})
    @ApiUnauthorizedResponse({status: HttpStatus.UNAUTHORIZED, description: 'Not authorized'})
    @ApiBadRequestResponse({status: HttpStatus.BAD_REQUEST, description: 'Bad Request'})
    @ApiInternalServerErrorResponse({status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Server Error.'})
    async deleteOne(
        @Param('id') id: number,
        @Request() req: any,
        @Response() response: any,
    ) {
        const canDoAction: boolean = this._authSecurityCrud.deleteOneAuth(req, response, this);
        if (canDoAction) {
            const isIdValid = !isNaN(Number(id));
            if (isIdValid) {
                try {
                    const recordDeleted = await this._principalService.deleteOne(Number(id));
                    response.status(HttpStatus.OK).send(recordDeleted);
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
        } else {
            response.status(HttpStatus.UNAUTHORIZED).send({message: 'Not authorized'});
        }
    }

    @Get(':id')
    @ApiOkResponse({status: HttpStatus.OK, description: 'The record has been fetched.'})
    @ApiUnauthorizedResponse({status: HttpStatus.UNAUTHORIZED, description: 'Not authorized'})
    @ApiBadRequestResponse({status: HttpStatus.BAD_REQUEST, description: 'Bad Request'})
    @ApiInternalServerErrorResponse({status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Server Error.'})
    async findOneById(
        @Param('id') id: number,
        @Request() req: any,
        @Response() response: any,
    ) {
        const canDoAction: boolean = this._authSecurityCrud.findOneByIdAuht(req, response, this);
        if (canDoAction) {
            const isIdValid = !isNaN(Number(id));
            if (isIdValid) {
                try {
                    const fetchedRecord = await this._principalService.findOneById(
                        Number(id),
                    );
                    response.status(HttpStatus.OK).send(fetchedRecord);
                } catch (error) {
                    console.error(
                        {
                            error,
                            mensaje: 'Error on fetch results',
                            data: {id},
                        },
                    );
                    response.status(HttpStatus.INTERNAL_SERVER_ERROR).send({message: 'Server Error'});
                }
            } else {
                response.status(HttpStatus.BAD_REQUEST).send({message: 'Invalid Id'});
            }
        } else {
            response.status(HttpStatus.UNAUTHORIZED).send({message: 'Not authorized'});
        }
    }

    @Get()
    @ApiOkResponse({status: HttpStatus.OK, description: 'The records has been fetched.', type: GenericFindResponse})
    @ApiUnauthorizedResponse({status: HttpStatus.UNAUTHORIZED, description: 'Not authorized'})
    @ApiBadRequestResponse({status: HttpStatus.BAD_REQUEST, description: 'Bad Request'})
    @ApiInternalServerErrorResponse({status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Server Error.'})
    async findAll(
        @Query('query') searchCriteria: any,
        @Request() req: any,
        @Response() response: any,
    ) {
        const canDoAction: boolean = this._authSecurityCrud.findAllAuth(req, response, this);
        if (canDoAction) {
            let skip = 0;
            let take = 10;
            let result: [Entidad[], number];
            try {
                let query: FindFullQuery;
                if (searchCriteria) {
                    query = JSON.parse(searchCriteria);
                    result = await this._principalService.findAll(query);
                    skip = query.skip ? query.skip : 0;
                    take = query.take ? query.take : 10;
                } else {
                    query = {where: {}, skip: 0, take: 10};
                    result = await this._principalService.findAll({} as FindFullQuery);
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
                    partialQuery.where = Object.keys(query.where).length > 0 ? partialQuery.where : undefined;
                    nextQuery = partialQuery;
                }
                const queryResponse = {
                    nextQuery,
                    data: result[0],
                    total: result[1],
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
                result = await this._principalService.findAll();
                const defaultQueryResponse = {
                    nextQuery: {skip: 10, take},
                    data: result[0],
                    total: result[1],
                };
                response.status(HttpStatus.OK).json(defaultQueryResponse);
            }
        } else {
            response.status(HttpStatus.UNAUTHORIZED).send({message: 'Not authorized'});
        }
    }
}

