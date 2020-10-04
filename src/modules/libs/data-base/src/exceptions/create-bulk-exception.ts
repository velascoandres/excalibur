import {BulkErrors} from '../interfaces/bulk-errors.interface';

export class CreateBulkException {
    constructor(
        protected errors: Partial<BulkErrors>,
    ) {
    }

    public toString(): Partial<BulkErrors> {
        return this.errors;
    }
}
