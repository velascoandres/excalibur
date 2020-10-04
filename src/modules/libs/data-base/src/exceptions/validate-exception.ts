import {BulkErrors} from '../interfaces/bulk-errors.interface';

export class ValidateException {
    constructor(
        protected error: any,
    ) {
    }

    public toString(): Pick<BulkErrors, 'validationError'> {
        return {
            validationError: this.error,
        };
    }
}
