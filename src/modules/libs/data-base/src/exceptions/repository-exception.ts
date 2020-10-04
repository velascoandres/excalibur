import {BulkErrors} from '../interfaces/bulk-errors.interface';

export class RepositoryException {
    constructor(
        protected error: any,
    ) {
    }

    public toString(): Pick<BulkErrors, 'repositoryError'> {
        return {
            repositoryError: this.error,
        };
    }
}
