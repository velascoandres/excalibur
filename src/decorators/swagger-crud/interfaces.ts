import {RequestBodyObject} from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import {Type} from '@nestjs/common';
import {SwaggerEnumType} from '@nestjs/swagger/dist/types/swagger-enum.type';
import {ApiBodyOptions} from '@nestjs/swagger';

export type RequestBodyOptions = Omit<RequestBodyObject, 'content'>;

export interface ApiBodyMetadata extends RequestBodyOptions {
    // tslint:disable-next-line:ban-types
    type?: Type<unknown> | Function | [Function] | string;
    isArray?: boolean;
    enum?: SwaggerEnumType;
}

export interface CrudApiConfig {
    createOne: ApiBodyOptions;
    updateOne: ApiBodyOptions;
    deleteOne: ApiBodyOptions;
    findOneById: ApiBodyOptions;
    findAll: ApiBodyOptions;
}