import {
    DeepPartial,
    DeleteWriteOpResultObject,
    InsertWriteOpResult,
    MongoRepository,
} from 'typeorm';
import { BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { PrincipalService } from './principal.service';
import { FindFullQuery, MongoIndexConfigInterface } from '../../..';
import { BaseMongoDTO } from '../../..';
import { PartialEntity } from '../../interfaces/service.crud.methods.interfaces';

export abstract class AbstractMongoService<Entity> extends PrincipalService<Entity> {
    protected constructor(
        private mongoRepository: MongoRepository<Entity>,
        private indexConfig?: MongoIndexConfigInterface,
    ) {
        super(
            mongoRepository,
        );
        if (indexConfig) {
            this.createIndex(indexConfig).then(
                indx => console.info('Index created: ', indx),
            ).catch(
                err => console.error('error on create index', err),
            );
        }
    }

    async createOne(row: DeepPartial<Entity> | BaseMongoDTO): Promise<Entity> {
        try {
            return this.mongoRepository.save(row as DeepPartial<Entity>);
        } catch (error) {
            throw new InternalServerErrorException('Error on delete document');
        }
    }

    async deleteOne(id: any): Promise<Entity> {
        try {
            const ObjectId = require('mongodb').ObjectID;
            return (await this.mongoRepository.findOneAndDelete(
                {
                    _id: ObjectId(id),
                }
            )).value;
        } catch (error) {
            throw new InternalServerErrorException('Error on delete document');
        }
    }

    async findAll(optionsOrConditions?: FindFullQuery): Promise<[Entity[], number]> {
        if (optionsOrConditions) {
            return await this.mongoRepository.findAndCount(optionsOrConditions);
        } else {
            return await this.mongoRepository.findAndCount({ skip: 0, take: 10 });
        }
    }

    async findOneById(id: any): Promise<Entity> {
        try {
            return await this.mongoRepository.findOne(
                id,
            ) as Entity;
        } catch (error) {
            throw new InternalServerErrorException(
                {
                    message: 'Error on fecth document by id'
                }
            );
        }
    }

    async updateOne(id: string | number, row: PartialEntity<Entity>): Promise<Entity> {
        try {
            const ObjectId = require('mongodb').ObjectID;
            const res = await this.mongoRepository.updateOne(
                {
                    _id: ObjectId(id),
                },
                { $set: { ...row } },
                { upsert: false, }
            );
            return await this.mongoRepository.findOne(id) as Entity;
        } catch (error) {
            throw new InternalServerErrorException(
                {
                    messague: 'Error on update'
                }
            );
        }
    }

    async createMany(documents: DeepPartial<Entity>[] | BaseMongoDTO[] | Entity[]): Promise<Entity[]> {
        let createdDocuments: InsertWriteOpResult;
        let ids = [];
        try {
            createdDocuments = await this.mongoRepository.insertMany(
                documents,
            );
        } catch (error) {
            console.error({ error, });
            throw new InternalServerErrorException('Error on create many documents');
        }
        try {
            ids = createdDocuments.insertedIds;
            const query = {
                where: {
                    _id: {
                        $in: [ids],
                    },
                },
            };
            return (await this.findAll(query))[0];
        } catch (error) {
            console.error({ error, });
            throw new InternalServerErrorException('Error on fecth the created documents');
        }
    }

    async updateMany(
        documents: DeepPartial<Entity>[] | BaseMongoDTO[]): Promise<Entity[]> {
        try {
            return await this.mongoRepository.save(
                documents as DeepPartial<Entity>[],
            );
        } catch (error) {
            console.error({ error, });
            throw new InternalServerErrorException('Error on updated many documents');
        }
    }

    async deleteMany(
        ids: any[]): Promise<number> {
        const ObjectId = require('mongodb').ObjectID;
        const formatIds = (ids as any[]).map(id => ObjectId(id));
        try {
            const deleteResponse: DeleteWriteOpResultObject = await this.mongoRepository.deleteMany(
                {
                    where: {
                        _id: { $in: [...formatIds] },
                    },
                }
            );
            return deleteResponse.deletedCount ? deleteResponse.deletedCount : 0;
        } catch (error) {
            console.error({ error, });
            throw new InternalServerErrorException('Error on delte many documents');
        }
    }

    async createIndex(config: MongoIndexConfigInterface): Promise<string> {
        try {
            return await this.mongoRepository
                .createCollectionIndex(
                    config.fieldOrSpec,
                    config.options,
                );
        } catch (error) {
            console.error({
                error,
                mensaje: 'maybe the index already exist',
            });
            throw new BadRequestException(error);
        }
    }

}
