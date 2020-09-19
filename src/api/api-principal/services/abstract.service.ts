import {DeepPartial, FindManyOptions, Repository} from 'typeorm';
import {InternalServerErrorException, NotFoundException} from '@nestjs/common';
import {findFull} from '../../..';
import {FindFullQuery} from '../../..';
import {ServiceCrudMethodsInterface} from '../../..';

export abstract class AbstractService<Entity> implements ServiceCrudMethodsInterface<Entity> {
    protected constructor(
        protected readonly _repository: Repository<Entity>,
    ) {
    }

    async createOne(record: DeepPartial<Entity>): Promise<Entity> {
        const createdRecord: any = await this._repository.create(record);
        // Conectarse a la db
        const savedRecord = await this._repository.save(createdRecord);
        return await this._repository.findOne(savedRecord.id) as Entity;
    }

    async updateOne(
        id: number,
        record: DeepPartial<Entity>,
    ): Promise<Entity> {
        try {
            const updatedRecord = await this._repository.update(+id, record);
        } catch (error) {
            console.error(
                {
                    error,
                    message: 'Error on update',
                    data: {
                        id,
                        record,
                    },
                },
            );
            throw new InternalServerErrorException(
                {
                    message: 'error on update',
                }
            );
        }
        const response = await this._repository.findOne(+id) as Entity;
        if (response) {
            return response;
        } else {
            throw new NotFoundException('Record not found');
        }
    }

    async deleteOne(recordId: number): Promise<Entity> {
        try {
            const recordToDelete = {...await this._repository.findOne(+recordId) as Entity};
            return await this._repository.remove(recordToDelete);
        } catch (error) {
            console.error({
                    error,
                },
            );
            throw new NotFoundException('Error on delete');
        }
    }

    async findAll(
        parametros?: FindFullQuery,
    ): Promise<[Entity[], number]> {
        const tieneParametros = parametros && Object.keys(parametros).length > 0;
        if (!tieneParametros) {
            return await this._repository.findAndCount({skip: 0, take: 10});
        } else {
            const tieneParametroWhere = parametros?.where !== undefined;
            const nombreTabla: string = this._repository.metadata.tableName;
            const conexion: string = this._repository.metadata.connection.name;
            if (tieneParametroWhere) {
                return await findFull<Entity>(nombreTabla, parametros as FindFullQuery, conexion);
            } else {
                const parametroReformulado = {
                    where: {},
                    ...parametros,
                };
                return await findFull<Entity>(nombreTabla, parametroReformulado as FindFullQuery, conexion);
            }
        }
    }

    async findOne(
        parametros?: FindManyOptions<Entity>,
    ): Promise<Entity> {
        try {
            return await this._repository.findOne(parametros) as Entity;
        } catch (error) {
            throw new InternalServerErrorException(
                {
                    message: 'Error on fecth document by id'
                }
            );
        }
    }

    async findOneById(id: number): Promise<Entity> {
        try {
            return await this._repository.findOne(id) as Entity;
        } catch (error) {
            throw new InternalServerErrorException(
                {
                    message: 'Error on fecth document by id'
                }
            );
        }
    }
}
