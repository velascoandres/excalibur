import {EntityManager, ObjectType} from 'typeorm';
import {FindFullQuery} from './interfaces/find-full-query';
import {InternalServerErrorException} from '@nestjs/common';
import {searchRecords} from './search-functions/search-records';
import {TransactionResponse} from './interfaces/transaction-response';
import {BASE_ENTITY_NAME} from './constants/query-operators';

export async function findFullTransaccion(
    transactionManager: EntityManager,
    entidad: ObjectType<{}>,
    query: FindFullQuery,
): Promise<TransactionResponse<[{}[], number]>> {
    const consulta = transactionManager.createQueryBuilder(entidad, BASE_ENTITY_NAME);
    try {
        const respuesta =  await searchRecords(consulta, query);
        return {
            response: respuesta,
            entityManager: transactionManager,
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