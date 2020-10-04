import {BulkErrors} from './bulk-errors.interface';

export interface LogInterface {
    creationOrder: number;
    entityName: string;
    errors?: BulkErrors;
    created?: number;
    connection: string;
}
