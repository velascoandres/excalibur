export class FileException {
    constructor(
        protected error: any,
    ) {
    }

    public toString(): any {
        return this.error.toString();
    }
}
