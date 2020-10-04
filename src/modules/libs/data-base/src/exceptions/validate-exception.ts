import {BulkErrors} from '../../../../..';
import {ValidationError} from 'class-validator';

export class ValidateException {
    constructor(
        protected error: any | ValidationError[],
    ) {
    }

    formatError(): any[] {
        return this.error.map(
            (error: ValidationError) => {
                return {
                    value: error.value,
                    constraints: error.constraints,
                    property: error.property
                };
            }
        );
    }

    public toString() {
        return this.error instanceof Array ? this.formatError() : this.error.toString();
    }
}
