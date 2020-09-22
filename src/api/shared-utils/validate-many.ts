import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';

export async function validateMany<T = any>(
    records: any[],
    dto: any,
): Promise<any[]> {
    let errors: any[] = [];
    for (const record of records) {
        if (record.id) {
            delete record.id;
        }
        const parsedRecord = plainToClass(dto, record);
        try {
            const validationResult = await validate(parsedRecord);
            errors = [
                ...errors,
                ...validationResult,
            ];
        } catch (error) {
            errors.push(error);
        }
    }
    return errors;
}