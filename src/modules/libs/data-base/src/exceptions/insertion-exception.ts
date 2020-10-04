export class InsertException {
    constructor(
        protected error: any,
    ) {
    }

    public toString() {
        return this.error.toString();
    }
}
