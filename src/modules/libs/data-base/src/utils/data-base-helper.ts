import {getConnection, ObjectType, Repository} from 'typeorm';
import {join} from 'path';
import {readFileSync} from 'fs';
import {FileException} from '../exceptions/file-exception';
import {parseAndValidateMany} from '../../../../../api/shared-utils/validate-many';
import {ValidateException} from '../exceptions/validate-exception';
import {CreateBulkException} from '../exceptions/create-bulk-exception';
import {ClassType} from 'class-transformer/ClassTransformer';
import {RepositoryException} from '../exceptions/repository-exception';
import {ValidationResponse} from '../interfaces/validation.response';
import {ConfigStore} from '../store/config.store';
import _ from 'lodash';

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

    private static handleRefs(refs: Partial<Record<string, Function>> | undefined, record: any): any {
        // verify if bulk has refs
        const clonnedRecord = {...record};
        const hasRerfs = !!refs;
        if (refs) {
            const entries = Object.entries(refs);
            // retrieve relations
            return entries.reduce(
                (recordReference: any, [relationName, relationMap]: [string, any]) => {
                    // {1: 'asdas1231', }
                    const relationDocument = relationMap.name;
                    const metaIndex = recordReference[relationName];
                    recordReference[relationName] = ConfigStore.noSqlRefs[relationDocument][metaIndex];
                    // delete recordReference[relationMap];
                    return recordReference;
                },
                clonnedRecord,
            );
        }
        return record;
    }

    private static handleMetaIndex(documentName: string, record: any): any {
        ConfigStore.addRefs(documentName, record.$metaID ,record.id);
        return record;
    }

    static async insertData<T = any, D = (new() => any)>(
        path: string,
        dtoClass: D | undefined,
        entity: ObjectType<T>,
        connection: string = 'default',
        refs?: Partial<Record<keyof T, Function>>,
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
        // handle refs
        try {
            parsedData = parsedData.map(parsedDat => DataBaseHelper.handleRefs(refs, parsedDat as any));
        } catch (error) {
            throw new CreateBulkException(
                {
                    refsError: error.toString(),
                }
            );
        }

        // preapare data
        try {

            const createdData = [];
            for (const parsed of parsedData) {

                const created = await repository.save(
                    _.omit(parsed as any, ['$metaID']),
                );
                if ((parsed as any).$metaID) {
                    DataBaseHelper.handleMetaIndex(entity.name, {...parsed, ...created});
                }
                createdData.push(created);
            }
            // console.log(createdData);
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
