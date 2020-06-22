import {EntityManager, ObjectType} from 'typeorm';
import {ConsultaFindFullInterface} from './interfaces/consulta.findFull.interface';
import {InternalServerErrorException} from '@nestjs/common';
import {buscarRegistros} from './search-functions/buscar-registros.funcion';
import {RespuestaTransaccionInterface} from './interfaces/respuesta.transaccion.interface';

export async function findFullTransaccion(
    transactionManager: EntityManager,
    entidad: ObjectType<{}>,
    query: ConsultaFindFullInterface,
): Promise<RespuestaTransaccionInterface<[{}[], number]>> {
    const consulta = transactionManager.createQueryBuilder(entidad, 'entidadBase');
    try {
        const respuesta =  await buscarRegistros(consulta, query);
        return {
            respuesta,
            transaccionManager: transactionManager,
        };
    } catch (error) {
        console.error(
            {
                error,
                mensaje: 'Error en generar la consulta con transaccion',
                data: {
                    query,
                },
            },
        );
        throw new InternalServerErrorException(
            {
                mensaje: 'Error en generar la consulta con transaccion',
            },
        );
    }
}