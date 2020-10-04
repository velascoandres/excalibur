export class RepositoryException {
    constructor(
        protected error: any,
    ) {
    }

    public toString(): any {
        return this.error.toString();
    }
}
