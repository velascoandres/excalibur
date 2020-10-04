import {BulkErrors} from '../interfaces/bulk-errors.interface';

export class FileException {
    constructor(
        protected error: any,
    ) {
    }

    public toString(): Pick<BulkErrors, 'fileError'> {
        return {
            fileError: this.error,
        };
    }
}
