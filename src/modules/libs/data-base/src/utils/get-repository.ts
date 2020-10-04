import {getManager, ObjectType} from 'typeorm';

export function getRepository<T>(
    entity: ObjectType<T>,
    connection: string = 'default',
) {
    const manager = getManager(connection);
    return manager.getRepository(entity);
}
