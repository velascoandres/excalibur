import {FindFullQuery, BaseDTO} from '../..';
import {DeepPartial, FindManyOptions} from 'typeorm';
import {MongodbIndexOptions} from 'typeorm/driver/mongodb/typings';
import {CrudMethodsInterface} from './crud-methods.interface';

export interface ServiceCrudMethodsInterface<T> extends CrudMethodsInterface{
    createOne: (row: T) => Promise<T>;
    updateOne: (id: number, row: T) => Promise<T>;
    findAll: (params?: FindFullQuery) => Promise<[T[], number]>;
    deleteOne: (id: number) => Promise<T>;
    findOneById: (id: number) => Promise<T>;
}

export interface MongoServiceCrudMethodsInterface<T> extends ServiceCrudMethodsInterface<T> {
    findAll: (optionsOrConditions?: FindManyOptions<T> | Partial<T>) => Promise<[T[], number]>;
    updateOne: (id: string | number, row: T) => Promise<T>;
}

export interface MongoIndexConfigInterface {
    fieldOrSpec: string | any;
    options?: MongodbIndexOptions;
}

export type PartialEntity<T> = DeepPartial<T> & BaseDTO;