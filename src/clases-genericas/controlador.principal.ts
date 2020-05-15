import {
    BadRequestException,
    Body,
    Delete,
    Get,
    HttpStatus,
    InternalServerErrorException,
    Param,
    Post,
    Put,
    Query,
    Request,
    Response, UnauthorizedException,
} from '@nestjs/common';
import {PrincipalService} from './principalService';
import {RespuestaPrincipalInterface} from '../interfaces/respuesta.principal.interface';
import {validate} from 'class-validator';
import {FindManyOptions, Like, UpdateResult} from 'typeorm';
import "reflect-metadata";
import "es6-shim";
import {plainToClass} from 'class-transformer';
import {ClassType} from 'class-transformer/ClassTransformer';
import {PrincipalAuthCrudValidation} from './seguridad.crud.abstracto';
import {PrincipalAuthCrudGenerico} from './principal.auth.crud.generico';
import {generarQuery} from '../funciones/busqueda/busqueda-simple/generar-query';

export abstract class ControladorPrincipal<Entidad, DtoCrear, DtoEditar>{
    nombreClaseDtoEditar: ClassType<DtoEditar> | any;
    nombreClaseDtoCrear: ClassType<DtoCrear> | any;

    protected constructor(
        private readonly _principalService: PrincipalService<Entidad>,
        private readonly _authSecurityCrud: PrincipalAuthCrudValidation<Entidad> = new PrincipalAuthCrudGenerico(),
    ) {
    }

    @Post()
    async createOne(
        @Body() nuevo: DtoCrear,
        @Request() req: any,
        @Response() response: any,
    ): Promise<Entidad> {
        const puedeRealizarAccion: boolean = this._authSecurityCrud.createOneAuht(req, response, this);
        if (puedeRealizarAccion){
            const entidadoDto = plainToClass(this.nombreClaseDtoCrear, nuevo) as Object;
            const erroresValidacion = await validate(entidadoDto);
            if (erroresValidacion.length > 0) {
                throw new BadRequestException(erroresValidacion);
            } else {
                try {
                    const nuevoRegistro = await this._principalService.createOne(nuevo);
                    return nuevoRegistro as Entidad;
                } catch (error) {
                    console.error(
                        {
                            error,
                            mensaje: 'Error on create',
                            data: {registro: nuevo},
                        }
                    );
                    throw new BadRequestException(error);
                }
            }
        } else {
            throw new UnauthorizedException('Not access granted');
        }

    }

    @Put(':id')
    async updateOne(
        @Body() datosActualizar: DtoEditar,
        @Param('id') id: number,
        @Request() req: any,
        @Response() response: any,
    ): Promise<RespuestaPrincipalInterface<Entidad | UpdateResult | any>> {
        const puedeRealizarAccion: boolean = this._authSecurityCrud.updateOneAuht(req, response, this);
        if (puedeRealizarAccion){
            const idValido = !isNaN(Number(id));
            if (idValido) {
                const entidadoDto = plainToClass(this.nombreClaseDtoEditar, datosActualizar) as Object;
                const erroresValidacion = await validate(entidadoDto);
                if (erroresValidacion.length > 0) {
                    throw new BadRequestException(erroresValidacion);
                } else {
                    try {
                        const registroActualizadoActualizado = await this._principalService.updateOne(
                            Number(id),
                            datosActualizar,
                        );
                        return {
                            data: registroActualizadoActualizado,
                        };
                    } catch (error) {
                        console.error(
                            {
                                error,
                                mensaje: 'Error al actualizar',
                                data: {id, datosActualizar},
                            }
                        );
                        throw new InternalServerErrorException(error);
                    }
                }
            } else {
                throw new BadRequestException('invalid id');
            }
        }else {
            throw new UnauthorizedException('Not access granted');
        }
    }

    @Delete(':id')
    async deleteOne(
        @Param('id') id: number,
        @Request() req: any,
        @Response() response: any,
    ): Promise<RespuestaPrincipalInterface<Entidad>> {
        const puedeRealizarAccion: boolean = this._authSecurityCrud.deleteOneAuth(req, response, this);
        if (puedeRealizarAccion){
            const idValido = !isNaN(Number(id));
            if (idValido) {
                try {
                    const registroBorrado = await this._principalService.deleteOne(Number(id));
                    return {
                        data: registroBorrado,
                        error: false,
                        statusCode: HttpStatus.ACCEPTED,
                    };
                } catch (error) {
                    console.error(
                        {
                            error,
                            mensaje: 'Error on delete',
                            data: {id},
                        },
                    );
                    throw new InternalServerErrorException(error);
                }
            } else {
                throw new BadRequestException('invalid id');
            }
        } else {
            throw new UnauthorizedException('Not access granted');
        }
    }

    @Get(':id')
    async findOneById(
        @Param('id') id: number,
        @Request() req: any,
        @Response() response: any,
    ): Promise<Entidad> {
        const puedeRealizarAccion: boolean = this._authSecurityCrud.findOneByIdAuht(req, response, this);
        if (puedeRealizarAccion){
            const idValido = !isNaN(Number(id));
            if (idValido) {
                try {
                    const registrosBuscados = await this._principalService.findOneById(
                        Number(id),
                    );
                    return registrosBuscados as Entidad;
                } catch (error) {
                    console.error(
                        {
                            error,
                            mensaje: 'Error on fetch results',
                            data: {id},
                        },
                    );
                    throw new InternalServerErrorException(error);
                }
            } else {
                throw new BadRequestException('invalid id');
            }
        } else {
            throw new UnauthorizedException('Not access granted');
        }
    }

    @Get()
    async findAll(
        @Query() criteriosBusqueda: any,
        @Request() req: any,
        @Response() response: any,
    ): Promise<[Entidad[], number]> {
        const puedeRealizarAccion: boolean = this._authSecurityCrud.findOneByIdAuht(req, response, this);
        if (puedeRealizarAccion){
            const mandaParametrosBusqueda = criteriosBusqueda !== undefined;
            try {
                let registros: [Entidad[], number];
                if (mandaParametrosBusqueda) {
                    const query = generarQuery(criteriosBusqueda);
                    registros = await this._principalService.findAll(query);
                } else {
                    registros = await this._principalService.findAll({
                        order: {id: 'DESC'},
                    });
                }
                return [
                    registros[0],
                    registros[1],
                ];
            } catch (error) {
                console.error(
                    {
                        error,
                        mensaje: 'Error on fetch results',
                        data: criteriosBusqueda,
                    },
                );
                throw new InternalServerErrorException(error);
            }
        } else {
            throw new UnauthorizedException('Not access granted');
        }
    }
}

