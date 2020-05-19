import {
    ParameterObject,
    RequestBodyObject,
} from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import {Type} from '@nestjs/common';
import {SwaggerEnumType} from '@nestjs/swagger/dist/types/swagger-enum.type';
import {ApiBodyOptions, ApiQueryOptions, ApiResponseOptions} from '@nestjs/swagger';

export type RequestBodyOptions = Omit<RequestBodyObject, 'content'>;
export type Prototipo = { [x: string]: object; prototype: { [x: string]: object; }; };
export  type ParameterOptions = Omit<ParameterObject, 'in' | 'schema'>;
export interface ApiQueryMetadata extends ParameterOptions {
    // tslint:disable-next-line:ban-types
    type?: Type<unknown> | Function | [Function] | string;
    isArray?: boolean;
    enum?: SwaggerEnumType;
    enumName?: string;
}


export interface ApiBodyMetadata extends RequestBodyOptions {
    // tslint:disable-next-line:ban-types
    type?: Type<unknown> | Function | [Function] | string;
    isArray?: boolean;
    enum?: SwaggerEnumType;
}

export interface CrudApiConfig {
    createOne?: CreateUpdateOneConfig;
    updateOne?: CreateUpdateOneConfig;
    findAll?: BaseConfig;
}
export interface BaseConfig {
    response?: ApiResponseOptions;
    apiQuery?: ApiQueryOptions;
}

export interface CreateUpdateOneConfig {
    apiBody: ApiBodyOptions;
}