import { DeepPartial, EntityManager, FindConditions, ObjectID } from 'typeorm';
import { FindFullQuery } from '../../..';
import { AbstractService } from './abstract.service';
import { findFullTransaccion } from '../../functions/search/complex-search/find-full.transaction.function';

export abstract class AbstractSQLService<Entity> extends AbstractService<Entity> {

    async findAllWithTransaction(entityManager: EntityManager, query: FindFullQuery) {
        const tableName: string = this._repository.metadata.tableName;
        return await findFullTransaccion<Entity>(entityManager, tableName, query as FindFullQuery);
    }

    async findOneWithTransaction(
        entityManager: EntityManager,
        criteria: string | string[] | number | number[] | Date | Date[] | ObjectID | ObjectID[] | FindConditions<Entity>,
        record: DeepPartial<Entity>
    ) {
        const tableName: string = this._repository.metadata.tableName;
        const repository = entityManager.getRepository(tableName);
        return await repository.findOne(criteria, record);
    }

    async updateOneWithTransaction(
        entityManager: EntityManager,
        criteria: string | string[] | number | number[] | Date | Date[] | ObjectID | ObjectID[] | FindConditions<Entity>,
        record: DeepPartial<Entity>
    ) {
        const tableName: string = this._repository.metadata.tableName;
        const repository = entityManager.getRepository(tableName);
        return await repository.update(criteria, record);
    }

    async createOneWithTransaction(entityManager: EntityManager, newRecord: DeepPartial<Entity>) {
        const tableName: string = this._repository.metadata.tableName;
        const repository = entityManager.getRepository(tableName);
        return await repository.save(newRecord);
    }

    async deleteOneWithTransaction(
        entityManager: EntityManager,
        criteria: string | string[] | number | number[] | Date | Date[] | ObjectID | ObjectID[] | FindConditions<Entity>,
    ) {
        const tableName: string = this._repository.metadata.tableName;
        const repository = entityManager.getRepository(tableName);
        return await repository.delete(criteria);
    }
}
