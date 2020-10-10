import {ValidationArguments} from 'class-validator';

export interface HasMap {
    [key: string]: any;
}

export type ValidationFunction = (value: any, ...args: any[]) => boolean;

export interface TypesCollectionInterface {
    [k: string]: ValidationFunction;
}

export type TypesValidator = Record<string, ValidationFunction>;

export type TypesCollectionArguments<T = TypesCollectionInterface> = {
    [k in keyof T]: HasMap | ValidationArguments;
};
