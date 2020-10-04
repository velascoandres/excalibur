import {getManager, ObjectType, Repository} from 'typeorm';

export function getRepository<T>(
    entity: ObjectType<T>,
    connection: string = 'default',
): Repository<T> {
    const manager = getManager(connection);
    return manager.getRepository(entity);
}
