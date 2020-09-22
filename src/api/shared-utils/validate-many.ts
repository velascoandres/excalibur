import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';

export async function validateMany<T = any>(
    records: any[],
    dto: any,
): Promise<any[]> {
    const errors = [];
    for (const record of records) {
        if (record.id) {
            delete record.id;
        }
        const parsedRecord = plainToClass(dto, record);
        let errores = [];
        try {
            errores = await validate(parsedRecord);
        } catch (error) {
            errors.push(error);
        }
    }
    return errors;
}