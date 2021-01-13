import {FilterQuery, Model} from 'mongoose';
import {Document} from 'mongoose';
import {MongooseCrudMethodsInterface} from '../../interfaces/service.crud.methods.interfaces';
import {
    CreateManyException,
    CreateOneException,
    DeleteOneException,
    FindAllException,
    FindOneByIdException,
    UpdateOneException
} from '../exceptions/crud-exception.filter';

export abstract class AbstractMongooseService<T extends Document> implements MongooseCrudMethodsInterface<T> {
    protected constructor(
        protected abstractModel: Model<T>) {
    }

    async createMany(rows: Partial<T>[]): Promise<T[]> {
        try {
            return await this.abstractModel.insertMany(rows);
        } catch (error) {
            throw new CreateManyException(
                {
                    error,
                    message: 'Error on create many',
                    data: {
                        documents: rows,
                    },
                },
            );
        }
    }

    createOne(row: Partial<T>): Promise<T> {
        try {
            const createdDocument = new this.abstractModel(row);
            return createdDocument.save();
        } catch (error) {
            throw new CreateOneException(
                {
                    error,
                    message: 'Error on delete',
                    data: {
                        document: row,
                    },
                },
            );
        }

    }

    async deleteOne(id: any): Promise<T> {
        try {
            const document = await this.abstractModel.findById(id);
            await this.abstractModel
                .findByIdAndDelete({id});
            return document as T;
        } catch (error) {
            throw new DeleteOneException(
                {
                    error,
                    message: 'Error on delete',
                    data: {
                        id,
                    }
                },
            );
        }

    }

    async findAll(filter: FilterQuery<T>, projection?: any | null, options?: any | null): Promise<[T[], number]> {
        try {
            const total = await this.abstractModel.countDocuments(filter);

            const promise = new Promise<[T[], number]>(
                (resolve, reject) => {
                    this.abstractModel.find(
                        filter, projection, options,
                        (err, docs: T[]) => {
                            if (err) {
                                reject(err);
                            } else {
                                resolve([docs, total]);
                            }
                        },
                    );
                }
            );
            return await promise;
        } catch (error) {
            throw new FindAllException(
                {
                    error,
                    message: 'Error on find documents',
                    data: {
                        filter,
                        projection,
                        options,
                    },
                },
            );
        }

    }

    async findOneById(id: string): Promise<T> {
        try {
            const document = await this.abstractModel.findById(id);
            return document as T;
        } catch (error) {
            throw new FindOneByIdException(
                {
                    error,
                    message: 'Error on fetch document by id',
                    data: {
                        id,
                    },
                },
            );
        }
    }

    async updateOne(id: string, document: any): Promise<T> {
        try {
            const promise = new Promise(
                (resolve, reject) => {
                    this.abstractModel.findByIdAndUpdate(
                        id,
                        document,
                        {upsert: false},
                        (err, doc: T | null,) => {
                            if (err) {
                                reject(err);
                            } else {
                                resolve(doc);
                            }
                        }
                    );
                },
            );

            return await promise as T;
        } catch (error) {
            throw new UpdateOneException(
                {
                    error,
                    message: 'Error on update document',
                    data: {
                        id,
                        document,
                    },
                },
            );
        }
    }

}

