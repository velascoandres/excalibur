import {
    ParameterObject,
    RequestBodyObject, SchemaObject,
} from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import {Type} from '@nestjs/common';
import {SwaggerEnumType} from '@nestjs/swagger/dist/types/swagger-enum.type';
import {ApiBodyOptions, ApiHeaderOptions, ApiParamOptions, ApiQueryOptions, ApiResponseOptions} from '@nestjs/swagger';
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

export interface ApiParamMetadata extends ParameterOptions {
    type?: Type<unknown> | Function | [Function] | string;
    enum?: SwaggerEnumType;
    enumName?: string;
}

export interface ApiParamSchemaHost extends ParameterOptions {
    schema: SchemaObject;
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
    createOne?: CreateOneConfig;
    createMany?: CreateOneConfig;
    updateOne?: UpdateOneConfig;
    findAll?: BaseConfig;
    deleteOne?: DeleteOneConfig;
    findOneById? : FindOneByIdConfig;
}

export interface BaseConfig {
    headers?: ApiHeaderOptions[];
    responses?: ApiResponseOptions[];
    apiQuery?: ApiQueryOptions;
    security?: any;
}

export interface DeleteOneConfig extends  BaseConfig {
    param?: ApiParamOptions;
}

export interface FindOneByIdConfig extends  BaseConfig {
    param?: ApiParamOptions;
}

export interface CreateOneConfig extends BaseConfig {
    apiBody: ApiBodyOptions;
}

export interface UpdateOneConfig extends BaseConfig {
    apiBody: ApiBodyOptions;
    param?: ApiParamOptions;
}
