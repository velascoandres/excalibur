import {DeepPartial, FindManyOptions, Repository} from 'typeorm';
import {InternalServerErrorException, NotFoundException} from '@nestjs/common';
import {findFull} from '../../..';
import {FindFullQuery} from '../../..';
import {ServiceCrudMethodsInterface} from '../../..';

export abstract class AbstractService<Entity> implements ServiceCrudMethodsInterface<Entity> {
    protected constructor(
        private readonly _repository: Repository<Entity>,
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
            const updatedRecord = await this._repository.update(id, record);
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
        const response = await this._repository.findOne(id) as Entity;
        if (response) {
            return response;
        } else {
            throw new NotFoundException('Record not found');
        }
    }

    async deleteOne(recordId: number): Promise<Entity> {
        // CREA UNA INSTANCIA DE LA ENTIDAD
        let recordToDelete: Entity;
        try {
            recordToDelete = await this.findOneById(recordId);
        } catch (error) {
            throw new NotFoundException(
                {
                    message: 'Record not found'
                }
            );
        }
        try {
            const deletedRecord = await this._repository.remove(recordToDelete);
            return recordToDelete;
        } catch (e) {
            throw new NotFoundException('Record not found');
        }
    }

    async findAll(
        parametros?: FindFullQuery,
    ): Promise<[Entity[], number]> {
        const tieneParametros = parametros && Object.keys(parametros).length > 0;
        if (!tieneParametros) {
            return await this._repository.findAndCount({skip: 0, take: 10});
        } else {
            const nombreTabla: string = this._repository.metadata.tableName;
            const conexion: string = this._repository.metadata.connection.name;
            return await findFull<Entity>(nombreTabla, parametros as FindFullQuery, conexion);
        }
    }

    async findOne(
        parametros?: FindManyOptions<Entity>,
    ): Promise<Entity> {
        return await this._repository.findOne(parametros) as Entity;
    }

    async findOneById(id: number): Promise<Entity> {
        return await this._repository.findOne(id) as Entity;
    }
}
