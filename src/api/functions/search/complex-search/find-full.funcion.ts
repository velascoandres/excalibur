import {getConnection, ObjectType} from 'typeorm';
import {FindFullQuery} from './interfaces/find-full-query';
import {InternalServerErrorException} from '@nestjs/common';
import {searchRecords} from './search-functions/search-records';
import {BASE_ENTITY_NAME} from './constants/query-operators';

export async function findFull<T = any>(
    entity: ObjectType<{}> | string,
    query: FindFullQuery,
    conexion: string = 'default',
) {
    const currentQuery = getConnection(conexion).createQueryBuilder(entity, BASE_ENTITY_NAME);
    try {
        return await searchRecords(currentQuery, query) as [any[], number];
    } catch (error) {
        console.error(
            {
                error,
                message: 'Error on generate query',
                data: {
                    query,
                },
            },
        );
        throw new InternalServerErrorException(
            {
                message: 'Error on generate query',
            },
        );
    }
}