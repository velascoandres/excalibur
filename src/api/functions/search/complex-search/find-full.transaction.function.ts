import {EntityManager, ObjectType} from 'typeorm';
import {FindFullQuery} from './interfaces/find-full-query';
import {InternalServerErrorException} from '@nestjs/common';
import {searchRecords} from './search-functions/search-records';
import {TransactionResponse} from './interfaces/transaction-response';
import {BASE_ENTITY_NAME} from './constants/query-operators';

export async function findFullTransaccion(
    entityManager: EntityManager,
    entity: ObjectType<{}>,
    findFullQuery: FindFullQuery,
): Promise<TransactionResponse<[{}[], number]>> {
    const currentQuery = entityManager.createQueryBuilder(entity, BASE_ENTITY_NAME);
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