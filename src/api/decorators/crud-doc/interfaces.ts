import {
    ParameterObject,
    RequestBodyObject,
} from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import {Type} from '@nestjs/common';
import {SwaggerEnumType} from '@nestjs/swagger/dist/types/swagger-enum.type';
import {ApiBodyOptions, ApiHeaderOptions, ApiQueryOptions, ApiResponseOptions} from '@nestjs/swagger';
import {CrudMethodsInterface} from '../../interfaces/crud-methods.interface';

export type RequestBodyOptions = Omit<RequestBodyObject, 'content'>;
export type Prototype = { [x: string]: object; prototype: { [x: string]: object; }; };
export  type ParameterOptions = Omit<ParameterObject, 'in' | 'schema'>;

export interface ApiQueryMetadata extends ParameterOptions {
    type?: Type<unknown> | Function | [Function] | string;
    isArray?: boolean;
    enum?: SwaggerEnumType;
    enumName?: string;
}

export type CrudMethod = keyof (CrudMethodsInterface);

export type MetodosApi = {
    [k in CrudMethod]: CrudMethod;
};

export interface ApiBodyMetadata extends RequestBodyOptions {
    type?: Type<unknown> | Function | [Function] | string;
    isArray?: boolean;
    enum?: SwaggerEnumType;
}

export interface CrudApiDocConfig extends  CrudMethodsInterface{
    createOne?: CreateUpdateOneConfig;
    updateOne?: CreateUpdateOneConfig;
    findAll?: BaseConfig;
    deleteOne?: BaseConfig;
    findOneById? : BaseConfig;
}

export interface BaseConfig {
    headers?: ApiHeaderOptions[];
    responses?: ApiResponseOptions[];
    apiQuery?: ApiQueryOptions;
}

export interface CreateUpdateOneConfig extends BaseConfig {
    apiBody: ApiBodyOptions;
}