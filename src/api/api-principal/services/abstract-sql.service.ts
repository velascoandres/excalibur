import { EntityManager } from 'typeorm';
import { FindFullQuery } from '../../..';
import { AbstractService } from './abstract.service';
import { findFullTransaccion } from '../../functions/search/complex-search/find-full.transaction.function';

export abstract class AbstractSQLService<Entity> extends AbstractService<Entity> {

    async findAllWithTransaction(entityManager: EntityManager, query: FindFullQuery) {
        const tableName: string = this._repository.metadata.tableName;
        return await findFullTransaccion<Entity>(entityManager, tableName, query as FindFullQuery);
    }
}
