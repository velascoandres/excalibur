import {BaseConfig, CreateUpdateOneConfig} from '../../crud-doc/interfaces';
import {CrudGuards} from '../../crud-guards/interfaces/crud-guards-interfaces-types';

export interface CrudMethodOptions {
    guards?: CrudGuards;
    interceptors?: any[];
    headers?: any[];
    documentation?: BaseConfig | CreateUpdateOneConfig;
}

export type CrudMethodOptionsKeys = keyof CrudMethodOptions;

export interface CrudConfig {
    createOne?: CrudMethodOptions;
    updateOne?: CrudMethodOptions;
    findAll?: CrudMethodOptions;
    deleteOne?: CrudMethodOptions;
    findOneById?: CrudMethodOptions;
}