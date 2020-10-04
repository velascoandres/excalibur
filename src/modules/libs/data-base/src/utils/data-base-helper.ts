import {getManager, ObjectType, Repository} from 'typeorm';

export class DataBaseHelper {
    static getRepository<T>(
        entity: ObjectType<T>,
        connection: string = 'default',
    ): Repository<T> {
        const manager = getManager(connection);
        return manager.getRepository(entity);
    }
}
