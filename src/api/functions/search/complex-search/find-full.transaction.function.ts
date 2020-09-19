import {EntityManager, ObjectType, SelectQueryBuilder} from 'typeorm';
import {FindFullQuery} from './interfaces/find-full-query';
import {InternalServerErrorException} from '@nestjs/common';
import {searchRecords} from './search-functions/search-records';
import {TransactionResponse} from './interfaces/transaction-response';
import {BASE_ENTITY_NAME} from './constants/query-operators';

export async function findFullTransaccion<T>(
    entityManager: EntityManager,
    entity: string,
    findFullQuery: FindFullQuery,
): Promise<TransactionResponse<[{}[], number]>> {
    const currentQuery: SelectQueryBuilder<T> = entityManager.createQueryBuilder(entity, BASE_ENTITY_NAME);
    try {
        const data =  await searchRecords(currentQuery, findFullQuery);
        return {
            response: data,
            entityManager,
        };
    } catch (error) {
        console.error(
            {
                error,
                message: 'Error on generate query',
                data: {
                    query: findFullQuery,
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