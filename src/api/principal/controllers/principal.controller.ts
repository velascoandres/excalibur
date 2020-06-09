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
import {PrincipalService} from '../../..';
import {validate} from 'class-validator';
import 'reflect-metadata';
import 'es6-shim';
import {plainToClass} from 'class-transformer';
import {PrincipalAuthCrudValidation} from '../../..';
import {AuthCrudGenerico} from '../auth/auth.crud.generico';
import {PrincipalDto} from '../../..';
import {
    ApiBadRequestResponse,
    ApiCreatedResponse,
    ApiInternalServerErrorResponse, ApiOkResponse,
    ApiUnauthorizedResponse
} from '@nestjs/swagger';
import {ConsultaFindFullInterface} from '../../..';
import {GenericFindResponse} from './generic-find.response';
import {ControllerCrudMehods, DtoConfigInterface} from '../../interfaces/controllers.interfaces';
import {DeepPartial} from 'typeorm';

export abstract class PrincipalController<Entidad = any> implements ControllerCrudMehods<Entidad>{
    protected constructor(
        private readonly _principalService: PrincipalService<Entidad>,
        private readonly _dtoConfig: DtoConfigInterface = {createDtoType: PrincipalDto, updateDtoType: PrincipalDto},
        private readonly _authSecurityCrud: PrincipalAuthCrudValidation = new AuthCrudGenerico(),
    ) {
    }

    @Post()
    @ApiCreatedResponse({status: HttpStatus.OK, description: 'The record has been successfully created.'})
    @ApiUnauthorizedResponse({status: HttpStatus.UNAUTHORIZED, description: 'UNAUTHORIZED'})
    @ApiBadRequestResponse({status: HttpStatus.BAD_REQUEST, description: 'Bad Request'})
    @ApiInternalServerErrorResponse({status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Server Error.'})
    async createOne(
        @Body() newRecord: DeepPartial<Entidad>,
        @Request() req: any,
        @Response() response: any,
    ) {
        const puedeRealizarAccion: boolean = this._authSecurityCrud.createOneAuht(req, response, this);
        if (puedeRealizarAccion) {
            const entidadoDto = plainToClass(this._dtoConfig.createDtoType, newRecord) as object;
            const erroresValidacion = await validate(entidadoDto);
            if (erroresValidacion.length > 0) {
                response.status(HttpStatus.BAD_REQUEST).send({message: 'Bad Request'});
            } else {
                try {
                    const nuevoRegistro = await this._principalService.createOne(newRecord);
                    response.status(HttpStatus.OK).send(nuevoRegistro);
                } catch (error) {
                    console.error(
                        {
                            error,
                            mensaje: 'Error on create',
                            data: {record: newRecord},
                        }
                    );
                    response.status(HttpStatus.INTERNAL_SERVER_ERROR).send({message: 'Server Error'});
                }
            }
        } else {
            response.status(HttpStatus.UNAUTHORIZED).send({message: 'UNAUTHORIZED'});
        }

    }

    @Put(':id')
    @ApiOkResponse({status: HttpStatus.OK, description: 'The record has been successfully updated.'})
    @ApiUnauthorizedResponse({status: HttpStatus.UNAUTHORIZED, description: 'UNAUTHORIZED'})
    @ApiBadRequestResponse({status: HttpStatus.BAD_REQUEST, description: 'Bad Request'})
    @ApiInternalServerErrorResponse({status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Server Error.'})
    async updateOne(
        @Body() recordToUpdate: DeepPartial<Entidad>,
        @Param('id') id: number,
        @Request() req: any,
        @Response() response: any,
    ) {
        const puedeRealizarAccion: boolean = this._authSecurityCrud.updateOneAuht(req, response, this);
        if (puedeRealizarAccion) {
            const idValido = !isNaN(Number(id));
            if (idValido) {
                const entidadoDto = plainToClass(this._dtoConfig.updateDtoType as typeof PrincipalDto, recordToUpdate) as object;
                const erroresValidacion = await validate(entidadoDto);
                if (erroresValidacion.length > 0) {
                    response.status(HttpStatus.BAD_REQUEST).send({message: 'Bad Request'});
                } else {
                    try {
                        const registroActualizadoActualizado = await this._principalService.updateOne(
                            Number(id),
                            recordToUpdate,
                        );
                        response.status(HttpStatus.OK).send(registroActualizadoActualizado);
                    } catch (error) {
                        console.error(
                            {
                                error,
                                mensaje: 'Error al actualizar',
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
            response.status(HttpStatus.UNAUTHORIZED).send({message: 'UNAUTHORIZED'});
        }
    }

    @Delete(':id')
    @ApiOkResponse({status: HttpStatus.OK, description: 'The record has been deleted.'})
    @ApiUnauthorizedResponse({status: HttpStatus.UNAUTHORIZED, description: 'UNAUTHORIZED'})
    @ApiBadRequestResponse({status: HttpStatus.BAD_REQUEST, description: 'Bad Request'})
    @ApiInternalServerErrorResponse({status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Server Error.'})
    async deleteOne(
        @Param('id') id: number,
        @Request() req: any,
        @Response() response: any,
    ) {
        const puedeRealizarAccion: boolean = this._authSecurityCrud.deleteOneAuth(req, response, this);
        if (puedeRealizarAccion) {
            const idValido = !isNaN(Number(id));
            if (idValido) {
                try {
                    const registroBorrado = await this._principalService.deleteOne(Number(id));
                    response.status(HttpStatus.OK).send(registroBorrado);
                } catch (error) {
                    console.error(
                        {
                            error,
                            mensaje: 'Error on delete',
                            data: {id},
                        },
                    );
                    response.status(HttpStatus.INTERNAL_SERVER_ERROR).send({message: 'Server Error'});
                }
            } else {
                response.status(HttpStatus.BAD_REQUEST).send({message: 'Invalid Id'});
            }
        } else {
            response.status(HttpStatus.UNAUTHORIZED).send({message: 'UNAUTHORIZED'});
        }
    }

    @Get(':id')
    @ApiOkResponse({status: HttpStatus.OK, description: 'The record has been fetched.'})
    @ApiUnauthorizedResponse({status: HttpStatus.UNAUTHORIZED, description: 'UNAUTHORIZED'})
    @ApiBadRequestResponse({status: HttpStatus.BAD_REQUEST, description: 'Bad Request'})
    @ApiInternalServerErrorResponse({status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Server Error.'})
    async findOneById(
        @Param('id') id: number,
        @Request() req: any,
        @Response() response: any,
    ) {
        const puedeRealizarAccion: boolean = this._authSecurityCrud.findOneByIdAuht(req, response, this);
        if (puedeRealizarAccion) {
            const idValido = !isNaN(Number(id));
            if (idValido) {
                try {
                    const registrosBuscados = await this._principalService.findOneById(
                        Number(id),
                    );
                    response.status(HttpStatus.OK).send(registrosBuscados);
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
            response.status(HttpStatus.UNAUTHORIZED).send({message: 'UNAUTHORIZED'});
        }
    }

    @Get()
    @ApiOkResponse({status: HttpStatus.OK, description: 'The records has been fetched.', type: GenericFindResponse})
    @ApiUnauthorizedResponse({status: HttpStatus.UNAUTHORIZED, description: 'UNAUTHORIZED'})
    @ApiBadRequestResponse({status: HttpStatus.BAD_REQUEST, description: 'Bad Request'})
    @ApiInternalServerErrorResponse({status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Server Error.'})
    async findAll(
        @Query('query') searchCriteria: any,
        @Request() req: any,
        @Response() response: any,
    ) {
        const puedeRealizarAccion: boolean = this._authSecurityCrud.findAllAuth(req, response, this);
        if (puedeRealizarAccion) {
            try {
                let resultado: [Entidad[], number];
                if (searchCriteria) {
                    const query = JSON.parse(searchCriteria);
                    resultado = await this._principalService.findAll(query);
                } else {
                    resultado = await this._principalService.findAll({} as ConsultaFindFullInterface);
                }
                const queryResponse = {
                    data: resultado[0],
                    total: resultado[1],
                }
                response.status(HttpStatus.OK).send(queryResponse);
            } catch (error) {
                console.error(
                    {
                        error,
                        mensaje: 'Error on fetch results',
                        data: searchCriteria,
                    },
                );
                response.status(HttpStatus.INTERNAL_SERVER_ERROR).send({message: 'Server Error'});
            }
        } else {
            response.status(HttpStatus.UNAUTHORIZED).send({message: 'UNAUTHORIZED'});
        }
    }
}

