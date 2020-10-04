import {BulkErrors} from '../../../../..';

export class CreateBulkException {
    constructor(
        protected errors: Partial<BulkErrors>,
    ) {
    }

    public toString(): Partial<BulkErrors> {
        return this.errors;
    }
}
