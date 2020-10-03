import {DeepPartial, EntityManager, FindConditions, ObjectID} from 'typeorm';
import {FindFullQuery} from '../../..';
import {PrincipalService} from './principal.service';
import {findFullTransaccion} from '../../..';
import {TransactionResponse} from '../../..';

export abstract class AbstractService<Entity> extends PrincipalService<Entity> {

    async findAllWithTransaction(entityManager: EntityManager, query: FindFullQuery): Promise<TransactionResponse<[Entity[], number]>> {
        const tableName: string = this._repository.metadata.tableName;
        return await findFullTransaccion<Entity>(entityManager, tableName, query as FindFullQuery);
    }

    async findOneWithTransaction(
        entityManager: EntityManager,
        criteria: string | string[] | number | number[] | Date | Date[] | ObjectID | ObjectID[] | FindConditions<Entity>,
        record: DeepPartial<Entity>
    ): Promise<TransactionResponse<Entity>> {
        const tableName: string = this._repository.metadata.tableName;
        const repository = entityManager.getRepository(tableName);
        const response = await repository.findOne(criteria, record) as Entity;
        return {
            response,
            entityManager,
        };
    }

    async updateOneWithTransaction(
        entityManager: EntityManager,
        criteria: string | string[] | number | number[] | Date | Date[] | ObjectID | ObjectID[] | FindConditions<Entity>,
        record: DeepPartial<Entity>
    ): Promise<TransactionResponse<Entity>> {
        const tableName: string = this._repository.metadata.tableName;
        const repository = entityManager.getRepository(tableName);
        const upadteResponse = await repository.update(criteria, record);
        const response = await repository.findOneOrFail(criteria) as Entity;
        return {
            response,
            entityManager,
        };
    }

    async createOneWithTransaction(entityManager: EntityManager, newRecord: DeepPartial<Entity>)
        : Promise<TransactionResponse<Entity>> {
        const tableName: string = this._repository.metadata.tableName;
        const repository = entityManager.getRepository(tableName);
        const response = await repository.save(newRecord) as Entity;
        return {
            response,
            entityManager,
        };
    }

    async createManyWithTransaction(entityManager: EntityManager, newRecords: DeepPartial<Entity>[])
        : Promise<TransactionResponse<Entity[]>> {
        const tableName: string = this._repository.metadata.tableName;
        const repository = entityManager.getRepository(tableName);
        const response = await repository.save(newRecords) as Entity[];
        return {
            response,
            entityManager,
        };
    }

    async deleteOneWithTransaction(
        entityManager: EntityManager,
        criteria: string | string[] | number | number[] | Date | Date[] | ObjectID | ObjectID[] | FindConditions<Entity>,
    ): Promise<TransactionResponse<Entity>> {
        const tableName: string = this._repository.metadata.tableName;
        const repository = entityManager.getRepository(tableName);
        const recordToDelete = await repository.findOneOrFail(criteria) as Entity;
        const deleteResponse = await repository.delete(criteria);
        return {
            entityManager,
            response: recordToDelete,
        };
    }

    async deleteManyByIdsWithTransaction(
        entityManager: EntityManager,
        ids: number[] | string[],
    ): Promise<TransactionResponse<Entity[]>> {
        const tableName: string = this._repository.metadata.tableName;
        const repository = entityManager.getRepository(tableName);
        const recordToDelete = await repository.findByIds(ids) as Entity[];
        const query = repository.createQueryBuilder(tableName)
            .delete()
            .where('id IN(:ids)', {ids: ids.join(',')});
        const deleteResponse = await query.execute();
        return {
            entityManager,
            response: recordToDelete,
        };
    }
}
