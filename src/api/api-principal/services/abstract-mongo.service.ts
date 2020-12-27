import {
    DeepPartial,
    DeleteWriteOpResultObject, FindManyOptions,
    InsertWriteOpResult,
    MongoRepository, ObjectID,
} from 'typeorm';
import {BadRequestException, InternalServerErrorException, Logger, NotFoundException} from '@nestjs/common';
import {PrincipalService} from './principal.service';
import {FindFullQuery, MongoIndexConfigInterface} from '../../..';
import {BaseMongoDTO} from '../../..';
import {PartialEntity} from '../../interfaces/service.crud.methods.interfaces';
import {
    CreateIndexException,
    CreateManyException, CreateOneException,
    DeleteManyException, DeleteOneException,
    FindAllException, FindOneByIdException,
    UpdateManyException, UpdateOneException
} from '../exceptions/crud-exception.filter';

export abstract class AbstractMongoService<Entity> extends PrincipalService<Entity> {
    protected constructor(
        private mongoRepository: MongoRepository<Entity>,
        private indexConfig?: MongoIndexConfigInterface,
    ) {
        super(
            mongoRepository,
        );
        const logger = new Logger();
        if (indexConfig) {
            this.createIndex(indexConfig).then(
                index => logger.log('Index created: ', index),
            ).catch(
                (createIndxException: CreateIndexException) => {
                    const {error, data} = createIndxException.errorPayload;
                    logger.error(`Error on create index on: ${this.constructor.name}`, data, error);
                },
            );
        }
    }

    async createOne(row: DeepPartial<Entity> | BaseMongoDTO): Promise<Entity> {
        try {
            return this.mongoRepository.save(row as DeepPartial<Entity>);
        } catch (error) {
            throw new CreateOneException(
                {
                    error,
                    message: 'Error on delete document',
                    data: {
                        document: row,
                    },
                }
            );
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
            throw new DeleteOneException(
                {
                    error,
                    message: 'Error on delete document',
                    data: {
                        id,
                    },
                },
            );
        }
    }

    async findAll(optionsOrConditions?: FindManyOptions | FindFullQuery): Promise<[Entity[], number]> {
        try {
            if (optionsOrConditions) {
                return await this.mongoRepository.findAndCount(optionsOrConditions);
            } else {
                return await this.mongoRepository.findAndCount({skip: 0, take: 10});
            }
        } catch (error) {
            throw  new FindAllException(
                {
                    error,
                    message: 'Error on fetch documents',
                    data: {
                        query: optionsOrConditions,
                    },
                },
            );
        }
    }

    async findOneById(id: any): Promise<Entity> {
        try {
            return await this.mongoRepository.findOneOrFail(
                id,
            ) as Entity;
        } catch (error) {
            throw new FindOneByIdException(
                {
                    error,
                    message: 'Record Not found',
                    data: {
                        id,
                    },
                },
            );
        }
    }

    async updateOne(id: string | number | ObjectID, row: PartialEntity<Entity>): Promise<Entity> {
        try {
            const ObjectId = require('mongodb').ObjectID;
            const updateResponse = await this.mongoRepository.updateOne(
                {
                    _id: ObjectId(id),
                },
                {$set: {...row}},
                {upsert: false,}
            );
            return await this.mongoRepository.findOne(id) as Entity;
        } catch (error) {
            throw new UpdateOneException(
                {
                    error,
                    message: 'Error on update',
                    data: {
                        id,
                        document: row,
                    },
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
            throw new CreateManyException(
                {
                    error,
                    message: 'Error on create many documents',
                    data: {
                        documents,
                    },
                },
            );
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
            throw new FindAllException(
                {
                    error,
                    message: 'Error on fecth the created documents',
                    data: {
                        created: documents,
                    },
                }
            );
        }
    }

    async updateMany(
        documents: DeepPartial<Entity>[] | BaseMongoDTO[]): Promise<Entity[]> {
        try {
            return await this.mongoRepository.save(
                documents as DeepPartial<Entity>[],
            );
        } catch (error) {
            throw new UpdateManyException(
                {
                    error,
                    message: 'Error on updated many documents',
                    data: {
                        documents,
                    }
                },
            );
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
                        _id: {$in: [...formatIds]},
                    },
                }
            );
            return deleteResponse.deletedCount ? deleteResponse.deletedCount : 0;
        } catch (error) {
            throw new DeleteManyException(
                {
                    error,
                    message: 'Error on delte many documents',
                    data: {
                        ids,
                    },
                }
            );
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
            throw new CreateIndexException(
                {
                    error,
                    message: 'maybe the index already exist',
                    data: {
                        config,
                    },
                },
            );
        }
    }

}
