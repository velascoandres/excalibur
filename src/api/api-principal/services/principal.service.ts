import {DeepPartial, FindManyOptions, Repository} from 'typeorm';
import {findFull} from '../../..';
import {FindFullQuery} from '../../..';
import {ServiceCrudMethodsInterface} from '../../..';
import {
    CreateManyException,
    CreateOneException,
    DeleteOneException,
    FindAllException,
    FindOneByIdException, FindOneException,
    UpdateOneException,
} from '../exceptions/crud-exception.filter';

export abstract class PrincipalService<Entity> implements ServiceCrudMethodsInterface<Entity> {
    protected constructor(
        protected readonly _repository: Repository<Entity>,
    ) {
    }

    async createMany(records: DeepPartial<Entity>[]): Promise<Entity[]> {
        try {
            return await this._repository.save(records);
        } catch (error) {
            throw new CreateManyException(
                {
                    error,
                    message: 'Error on create many',
                    data: {
                        records,
                    },
                },
            );
        }
    }

    async createOne(record: DeepPartial<Entity>): Promise<Entity> {
        try {
            return await this._repository.save(record) as Entity;
        } catch (error) {
            throw new CreateOneException(
                {
                    error,
                    message: 'Error on create',
                    data: record,
                },
            );
        }
    }

    async updateOne(
        id: number,
        record: DeepPartial<Entity>,
    ): Promise<Entity> {
        try {
            const updatedRecord = await this._repository.update(+id, record);
            return await this._repository.findOneOrFail(+id) as Entity;
        } catch (error) {
            throw new UpdateOneException(
                {
                    error,
                    message: 'Error on update',
                    data: {
                        id,
                        record,
                    },
                },
            );
        }
    }

    async deleteOne(recordId: number): Promise<Entity> {
        try {
            const recordToDelete = {...await this._repository.findOne(+recordId) as Entity};
            return await this._repository.remove(recordToDelete);
        } catch (error) {
            throw new DeleteOneException(
                {
                    error,
                    message: 'Error on delete',
                    data: {
                        id: recordId,
                    },
                },
            );
        }
    }

    async findAll(
        query?: FindFullQuery | FindManyOptions,
    ): Promise<[Entity[], number]> {
        try {
            const hasQuery = query && Object.keys(query).length > 0;
            if (!hasQuery) {
                return await this._repository.findAndCount({skip: 0, take: 10});
            } else {
                const hasWhereCondition = query?.where !== undefined;
                const tableName: string = this._repository.metadata.tableName;
                const connection: string = this._repository.metadata.connection.name;
                if (hasWhereCondition) {
                    return await findFull<Entity>(tableName, query as FindFullQuery, connection);
                } else {
                    const reformatQuery = {
                        where: {},
                        ...query,
                    };
                    return await findFull<Entity>(tableName, reformatQuery as FindFullQuery, connection);
                }
            }
        } catch (error) {
            throw new FindAllException(
                {
                    error,
                    message: 'Error on find',
                    data: {
                        query,
                    },
                },
            );
        }
    }

    async findOne(
        query?: FindManyOptions<Entity>,
    ): Promise<Entity> {
        try {
            return await this._repository.findOneOrFail(query) as Entity;
        } catch (error) {
            throw new FindOneException(
                {
                    error,
                    message: 'Error on fecth document by params',
                    data:{
                        query,
                    },
                }
            );
        }
    }

    async findOneById(id: number | string): Promise<Entity> {
        try {
            return await this._repository.findOneOrFail(id) as Entity;
        } catch (error) {
            throw new FindOneByIdException(
                {
                    error,
                    message: 'Error on fetch document by id',
                    data:{
                        id,
                    },
                }
            );
        }
    }
}
