import {ValidationResponse} from '../interfaces/validation.response';
import {ValidationError} from 'class-validator';

export class ValidateException<T = any> {
    constructor(
        protected error: any | ValidationResponse<T>[],
    ) {
    }

    formatError(): any[] {
        return this.error.map(
            (errorValidation: ValidationResponse<T>) => {
                const {errors, parsedData} = errorValidation;
                return {
                    parsedData,
                    errors: errors.toString(),
                };
            }
        );
    }

    public toString() {
        return this.error instanceof Array ? this.formatError() : this.error.toString();
    }
}
