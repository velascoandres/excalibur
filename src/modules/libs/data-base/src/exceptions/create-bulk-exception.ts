import {BulkErrors} from '../interfaces/bulk-errors.interface';

export class CreateBulkException {
    constructor(
        protected errors: BulkErrors,
    ) {
    }

    public toString(): BulkErrors {
        return this.errors;
    }
}
