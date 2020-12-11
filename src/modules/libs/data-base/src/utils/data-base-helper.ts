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
        // Find file
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
        let parsedData: D[] = [];
        if (dtoClass) {
            try {
                parsedData = await DataBaseHelper.validateMassive(dtoClass, records);
            } catch (error) {
                throw new CreateBulkException(
                    {
                        validationError: error.toString(),
                    }
                );
            }
        } else {
            parsedData = records;
        }

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
}
