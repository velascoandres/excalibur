import { plainToClass } from 'class-transformer';
import { ClassType } from 'class-transformer/ClassTransformer';
import { validate, ValidationError } from 'class-validator';


async function _parseAndValidate<T extends { [k: string]: any }>(
    record: T,
    dtoClass: ClassType<T>,
): Promise<{ parsedData: T, errors: ValidationError[] }> {
    if (record.id) {
        delete record.id;
    }
    const parsedRecord = plainToClass(dtoClass, record);
    let errors: any[] = [];
    try {
        const validationResult = await validate(parsedRecord);
        errors = [
            ...errors,
            ...validationResult,
        ];
    } catch (error) {
        errors.push(error);
    }
    return {
        errors,
        parsedData: parsedRecord,
    };
}


export async function validateMany<T extends { [k: string]: any }>(
    records: T[],
    dtoClass: ClassType<T>,
): Promise<ValidationError[]> {
    let validationErrors: any[] = [];
    for (const record of records) {
        const { errors } = await _parseAndValidate(record, dtoClass);
        validationErrors = [
            ...validationErrors,
            ...errors,
        ];
    }
    return validationErrors;
}

export async function parseAndValidateMany<T extends { [k: string]: any }>(
    records: T[],
    dtoClass: ClassType<T>,
): Promise<{ parsedData: T[], errors: ValidationError[] }> {
    let validationErrors: any[] = [];
    const data: T[] = [];
    for (const record of records) {
        const { errors, parsedData } = await _parseAndValidate(record, dtoClass);
        validationErrors = [
            ...validationErrors,
            ...errors,
        ];
        data.push(parsedData);
    }
    return {
        errors: validationErrors,
        parsedData: data,
    };
}