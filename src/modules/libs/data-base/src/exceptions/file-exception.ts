import {BulkErrors} from '../interfaces/bulk-errors.interface';

export class FileException {
    constructor(
        protected error: any,
    ) {
    }

    public toString(): any {
        return this.error.toString();
    }
}
