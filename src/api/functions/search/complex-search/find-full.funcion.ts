import {getConnection, ObjectType} from 'typeorm';
import {FindFullQuery} from './interfaces/find-full-query';
import {InternalServerErrorException} from '@nestjs/common';
import {searchRecords} from './search-functions/search-records';
import {BASE_ENTITY_NAME} from './constants/query-operators';

export async function findFull<T = any>(
    entidad: ObjectType<{}> | string,
    query: FindFullQuery,
    conexion: string = 'default',
) {
    const consulta = getConnection(conexion).createQueryBuilder(entidad, BASE_ENTITY_NAME);
    try {
        return await searchRecords(consulta, query) as [any[], number];
    } catch (error) {
        console.error(
            {
                error,
                mensaje: 'Error en generar la consulta',
                data: {
                    query,
                },
            },
        );
        throw new InternalServerErrorException(
            {
                mensaje: 'Error en generar la consulta',
            },
        );
    }
}