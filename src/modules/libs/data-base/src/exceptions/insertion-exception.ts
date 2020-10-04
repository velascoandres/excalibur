import {BulkErrors} from '../interfaces/bulk-errors.interface';

export class InsertException {
    constructor(
        protected error: any,
    ) {
    }

    public toString(): Pick<BulkErrors, 'insertionError'> {
        return {
            insertionError: this.error,
        };
    }
}
