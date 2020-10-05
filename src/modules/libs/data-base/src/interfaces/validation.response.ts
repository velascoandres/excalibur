import {ValidationError} from 'class-validator';

export interface ValidationResponse<T> {
    parsedData: T;
    errors: ValidationError[];
}
