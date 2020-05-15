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
} from '@nestjs/common';
import {PrincipalService} from './principalService';
import {RespuestaPrincipalInterface} from '../interfaces/respuesta.principal.interface';
import {validate} from 'class-validator';
import {FindManyOptions, Like, UpdateResult} from 'typeorm';
import "reflect-metadata";
import "es6-shim";
import {plainToClass} from 'class-transformer';
import {ClassType} from 'class-transformer/ClassTransformer';

export abstract class ControladorPrincipal<Entidad, DtoCrear, DtoEditar> {
    nombreClaseDtoEditar: ClassType<DtoEditar> | any;
    nombreClaseDtoCrear: ClassType<DtoCrear> | any;

    protected constructor(
        private readonly _principalService: PrincipalService<Entidad>,
    ) {
    }

    @Post()
    async create(
        @Body() nuevo: DtoCrear,
    ): Promise<Entidad> {
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
                        mensaje: 'Error al crear',
                        data: {registro: nuevo},
                    }
                );
                throw new BadRequestException(error);
            }
        }
    }

    @Put(':id')
    async updateOne(
        @Body() datosActualizar: DtoEditar,
        @Param('id') id: number,
    ): Promise<RespuestaPrincipalInterface<Entidad | UpdateResult | any>> {
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
            throw new BadRequestException('id inválido!!');
        }
    }

    @Delete(':id')
    async deleteOne(
        @Param('id') id: number,
    ): Promise<RespuestaPrincipalInterface<Entidad>> {
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
                        mensaje: 'Error al borrar el registro',
                        data: {id},
                    }
                );
                throw new InternalServerErrorException(error);
            }
        } else {
            throw new BadRequestException('id inválido!!');
        }
    }

    @Get(':id')
    async findOneById(
        @Param('id') id: number,
    ): Promise<Entidad> {
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
                        mensaje: 'Error al buscar registros',
                        data: {id},
                    },
                );
                throw new InternalServerErrorException(error);
            }
        } else {
            throw new BadRequestException('id inválido!!');
        }
    }

    @Get()
    async findAll(
        @Query() criteriosBusqueda: any,
    ): Promise<[Entidad[], number]> {
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
                    mensaje: 'Error al buscar registros',
                    data: criteriosBusqueda,
                },
            );
            throw new InternalServerErrorException(error);
        }
    }
}

export function convertirStringArreglo(cadena: string) {
    const longitud = cadena.length;
    const posicionFinal = longitud - 1;
    const soloTexto = cadena.slice(1, posicionFinal);
    return soloTexto.split(',');
}

export function generarQuery(parametro: any) {
    const llaves = Object.keys(parametro);
    const query: FindManyOptions = {
        order: {id: 'DESC'},
        skip: 0,
        take: 5,
    };
    llaves.forEach((llave: string) => {
        switch (llave) {
            case 'where':
                const parametrosWhere = JSON.parse(parametro[llave]); // {nombre: {like: 'abc'}}
                const valoresParametroWhere = Object.values(parametrosWhere); // [{'like':'abc'}, ...]
                const llavesParametroWhere = Object.keys(parametrosWhere); // ['nombre',...]
                valoresParametroWhere.forEach((valor: any, index) => {
                    if (typeof valor === 'object') {
                        const llaves = Object.keys(valor);
                        llaves.forEach(subLlave => {
                            if (subLlave === 'like') {
                                parametrosWhere[llavesParametroWhere[index]] = Like(
                                    `%${valor.like}%`,
                                );
                            }
                        });
                    }
                });
                query.where = parametrosWhere;
                break;
            case 'relations':
                query.relations = convertirStringArreglo(parametro[llave]);
                break;
            case 'order':
                query.order = JSON.parse(parametro[llave]);
                break;
            case 'skip':
                query.skip = !isNaN(+parametro[llave]) ? +parametro[llave] : 0;
                break;
            case 'take':
                query.take = !isNaN(+parametro[llave]) ? +parametro[llave] : 0;
                break;
        }
    });
    return query;
}
