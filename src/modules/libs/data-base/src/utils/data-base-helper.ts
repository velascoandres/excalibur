import {getManager, ObjectType, Repository} from 'typeorm';
import {join} from 'path';
import {readFileSync} from 'fs';
import {FileException} from '../exceptions/file-exception';
import {parseAndValidateMany} from '../../../../../api/shared-utils/validate-many';
import {ValidateException} from '../exceptions/validate-exception';

export class DataBaseHelper {
    static getRepository<T>(
        entity: ObjectType<T>,
        connection: string = 'default',
    ): Repository<T> {
        const manager = getManager(connection);
        return manager.getRepository(entity);
    }

    static readFile(path: string): any[] {
        const filePath = '../../../../../../../src';
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

    static async validateMassive(dtoClass: (new () => any), rows: any[]) {
        let errors = [];
        let parseData: any[] = [];
        try {
            const response = await parseAndValidateMany(rows, dtoClass);
            errors = response.errors;
            parseData = response.parsedData;
        } catch (error) {
            throw new ValidateException(error);
        }
        const hasErrors = errors.length > 0;
        if (hasErrors) {
            throw new ValidateException(errors);
        } else {
            return parseData;
        }
    }
}
