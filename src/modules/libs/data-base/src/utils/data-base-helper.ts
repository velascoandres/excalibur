import {getConnection, getManager, ObjectType, Repository} from 'typeorm';
import {join} from 'path';
import {readFileSync} from 'fs';
import {FileException} from '../exceptions/file-exception';
import {parseAndValidateMany} from '../../../../../api/shared-utils/validate-many';
import {ValidateException} from '../exceptions/validate-exception';
import {CreateBulkException} from '../exceptions/create-bulk-exception';
import {ClassType} from 'class-transformer/ClassTransformer';
import {RepositoryException} from '../exceptions/repository-exception';
import {ValidationResponse} from '../interfaces/validation.response';
import {Document, Schema} from 'mongoose';
import mongoose from 'mongoose';

export class DataBaseHelper {

    static getRepository<T>(
        entity: ObjectType<T>,
        connection: string = 'default',
    ): Repository<T> {
        try {
            const manager = getConnection(connection);
            return manager.getRepository(entity);
        } catch (error) {
            throw new RepositoryException(
                error,
            );
        }
    }

    static readFile(path: string): any[] {
        const filePath = '../../../../../../../../../';
        const joinedPath = join(__dirname, filePath, path);
        const rows = JSON.parse(
            readFileSync(joinedPath, 'utf-8'),
        );
        const isNotEmpty = rows.length > 0;
        if (isNotEmpty) {
            return rows;
        } else {
            throw new FileException('The file is empty');
        }
    }

    static async validateMassive<D>(dtoClass: (new () => any) | D, rows: any[]) {
        let errors = [];
        let parseData: any[] = [];
        try {
            const response: { parsedData: D[], errors: ValidationResponse<D>[] } = await parseAndValidateMany(rows, dtoClass as ClassType<D>);
            errors = response.errors;
            parseData = response.parsedData;
        } catch (error) {
            throw new ValidateException(error.toString());
        }
        const hasErrors = errors.length > 0;
        if (hasErrors) {
            throw new ValidateException(errors);
        } else {
            return parseData;
        }
    }

    static async insertData<T = any, D = (new() => any)>(
        path: string,
        dtoClass: D | undefined,
        entity: ObjectType<T>,
        connection: string = 'default',
    ): Promise<number> {
        // Get repository
        let repository: Repository<T>;
        try {
            repository = DataBaseHelper
                .getRepository(entity, connection);
        } catch (error) {
            throw new CreateBulkException(
                {
                    repositoryError: error,
                }
            );

        }
        // validate Files
        const parsedData = await DataBaseHelper.getParsedData(path, dtoClass);
        // insert data
        try {
            const createdData = await repository.save(parsedData);
            return createdData.length;
        } catch (error) {
            throw new CreateBulkException(
                {
                    insertionError: error.toString(),
                }
            );
        }
    }

    static async insertDataMongoose<T extends Document, D = (new() => any)>(
        path: string,
        dtoClass: D | undefined,
        modelName: any,
        schema: Schema,
        connection: string = 'default',
    ): Promise<number> {
        // Get repository
        // Find file
        const model = mongoose.connection.model(modelName, schema);
        // const model = mongoose.model(modelName, schema, undefined, true);
        const parsedData = await DataBaseHelper.getParsedData(path, dtoClass);
        // insert data
        try {
            const promise = new Promise<[T[], number]>(
                async (resolve, reject) => {
                   await model.insertMany(
                        parsedData,
                        (err, docs: any[]) => {
                            if (err) {
                                console.error('x7e', err);
                                reject(err);
                            } else {
                                console.error('x7e', docs);
                                resolve([docs, docs.length]);
                            }
                        },
                    );
                }
            );
            const created = await promise;
            return parsedData.length;
        } catch (error) {
            throw new CreateBulkException(
                {
                    insertionError: error.toString(),
                }
            );
        }
    }

    private static async getParsedData<D>(path: string, dtoClass: D | undefined) {
        let records: D[] = [];
        // let status: boolean = true;
        try {
            records = DataBaseHelper.readFile(path);
        } catch (error) {
            throw new CreateBulkException(
                {
                    fileError: error,
                }
            );
        }
        // validate Files
        if (dtoClass) {
            try {
                return await DataBaseHelper.validateMassive(dtoClass, records);
            } catch (error) {
                throw new CreateBulkException(
                    {
                        validationError: error.toString(),
                    }
                );
            }
        } else {
            return records;
        }
    }
}
