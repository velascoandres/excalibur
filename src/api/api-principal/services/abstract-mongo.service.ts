import {
    DeepPartial,
    DeleteWriteOpResultObject,
    FindManyOptions,
    InsertWriteOpResult,
    MongoRepository,
} from 'typeorm';
import {BadRequestException, InternalServerErrorException} from '@nestjs/common';
import {AbstractService} from './abstract.service';
import {MongoIndexConfigInterface, BaseDTO} from '../../..';
import {BaseMongoDTO} from '../../..';
import {PartialEntity} from '../../interfaces/service.crud.methods.interfaces';

export abstract class AbstractMongoService<Entity> extends AbstractService<Entity> {
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

    async createOne(row: DeepPartial<Entity> | BaseDTO): Promise<Entity> {
        try {
            return this.mongoRepository.save(row as DeepPartial<Entity>);
        } catch (error) {
            throw new InternalServerErrorException('Error on delete document');
        }
    }

    async deleteOne(id: number): Promise<Entity> {
        try {
            const ObjectId = require('mongodb').ObjectID;
            const deleteResponse = await this.mongoRepository.delete(
                ObjectId(id),
            );
            return this.findOneById(id);
        } catch (error) {
            throw new InternalServerErrorException('Error on delete document');
        }
    }

    async findAll(optionsOrConditions?: FindManyOptions<Entity> | Partial<Entity>): Promise<[Entity[], number]> {
        try {
            return await this.mongoRepository.findAndCount(optionsOrConditions);
        } catch (error) {
            throw new InternalServerErrorException('Error on fetch document');
        }
    }

    async findOneById(id: number): Promise<Entity> {
        const ObjectId = require('mongodb').ObjectID;
        try {
            return await this.mongoRepository.findOne({
                where: {
                    _id: ObjectId(id),
                },
            }) as Entity;
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
            await this.mongoRepository.findOneAndUpdate(ObjectId(id), row);
            return await this.mongoRepository.findOne({
                where: {
                    _id: ObjectId(id),
                },
            }) as Entity;
        } catch (error) {
            throw new InternalServerErrorException(
                {
                    messague: 'Error on update'
                }
            );
        }
    }

    async createMany(documents: DeepPartial<Entity>[] | BaseDTO[] | Entity[]): Promise<[Entity[], number]> {
        let createdDocuments: InsertWriteOpResult;
        let ids = [];
        try {
            createdDocuments = await this.mongoRepository.insertMany(
                documents,
            );
        } catch (error) {
            console.error({error,});
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
            return await this.findAll(query);
        } catch (error) {
            console.error({error,});
            throw new InternalServerErrorException('Error on fecth the created documents');
        }
    }

    async updateMany(
        documents: DeepPartial<Entity>[] | BaseMongoDTO[]): Promise<Entity[]> {
        const ObjectId = require('mongodb').ObjectID;
        const ids = (documents as any[]).map(doc => ObjectId(doc.id));
        try {
            return await this.mongoRepository.save(
                documents as DeepPartial<Entity>[],
            );
        } catch (error) {
            console.error({error,});
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
                        _id: {$in: [...formatIds]},
                    },
                }
            );
            return deleteResponse.deletedCount ? deleteResponse.deletedCount : 0;
        } catch (error) {
            console.error({error,});
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