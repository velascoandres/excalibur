import {Document, Model, Schema} from 'mongoose';
import {Type} from '@nestjs/common';

export interface BulkDataConfig {
    pathProd?: string;
    pathDev: string;
    dtoClassValidation?: (new () => any) | any;
    aliasName?: string;
    entity: Function;
    creationOrder: number;
    connection?: string;
}


export interface BulkMongooseDataConfig<T extends Document = any> extends Omit<BulkDataConfig, 'entity'> {
    document?: T;
    model: any;
    aliasName: string;
    schema: Schema;
}