
import {DeepPartial, FindManyOptions, InsertWriteOpResult, MongoRepository} from 'typeorm';
import {BadRequestException, InternalServerErrorException} from '@nestjs/common';
import {PrincipalService} from './principal.service';
import {MongoIndexConfigInterface} from '../../..';

export abstract class PrincipalMongoService<Entity> extends PrincipalService<Entity>{
    protected constructor(
        private service: MongoRepository<Entity>,
        private indexConfig?: MongoIndexConfigInterface,
    ) {
        super(
            service,
        );
        if (indexConfig) {
            this.createIndex(indexConfig).then(
                indx => console.info('Index created: ', indx),
            ).catch(
                err => console.error('error on create index', err),
            );
        }
    }

    async createOne(row: DeepPartial<Entity>): Promise<Entity> {
        try {
            return this.service.create(row);
        } catch (error) {
            throw new InternalServerErrorException('Error on delete document');
        }
    }

    async deleteOne(id: number): Promise<Entity> {
        try {
            const ObjectId = require('mongodb').ObjectID;
            const deleteResponse = await this.service.delete(
                ObjectId(id),
            );
            return this.findOneById(id);
        } catch (error) {
            throw new InternalServerErrorException('Error on delete document');
        }
    }

    async findAll(optionsOrConditions?: FindManyOptions<Entity> | Partial<Entity>): Promise<[Entity[], number]> {
        try {
            return await this.service.findAndCount(optionsOrConditions);
        } catch (error) {
            throw new InternalServerErrorException('Error on fetch document');
        }
    }

    async findOneById(id: number): Promise<Entity> {
        const ObjectId = require('mongodb').ObjectID;
        try {
            return await this.service.findOne({
                where: {
                    _id: ObjectId(id),
                },
            }) as Entity;
        } catch (error) {
            throw new InternalServerErrorException(
                {
                    message: 'Error on fecth document by id'
                }
            )
        }
    }

    async updateOne(id: string | number, row: DeepPartial<Entity>): Promise<Entity> {
        try {
            const ObjectId = require('mongodb').ObjectID;
            await this.service.findOneAndUpdate(ObjectId(id), row);
            return await this.service.findOne({
                where: {
                    _id: ObjectId(id),
                },
            }) as Entity;
        } catch (error) {
            throw new InternalServerErrorException(
                {
                    messague: 'Error on update'
                }
            )
        }
    }

    async createMany(localizaciones: Entity[]): Promise<[Entity[], number]> {
        let createdDocuments: InsertWriteOpResult;
        let ids = [];
        try {
            createdDocuments = await this.service.insertMany(
                localizaciones,
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

    async createIndex(config: MongoIndexConfigInterface): Promise<string> {
        try {
            return await this.service
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