import {ApiBodyMetadata, MetodosApi} from './interfaces';
import {ApiHeaderOptions, ApiParamOptions, ApiQueryOptions} from '@nestjs/swagger';

export const DEFAULT_BODY_METADATA: ApiBodyMetadata = {
    type: String,
    required: true,
};

export const DEFAULT_QUERY_OPTIONS: ApiQueryOptions = {
    name: '',
    required: true
};

export const DEFAULT_HEADER_OPTIONS: Partial<ApiHeaderOptions> = {
    name: '',
};


export const DEFAULT_PARAM_OPTIONS: ApiParamOptions = {
    name: '',
    required: true
};


export const API_METHODS_NAMES_OBJECT: MetodosApi = {
    createOne: 'createOne',
    updateOne: 'updateOne',
    deleteOne: 'deleteOne',
    findOneById: 'findOneById',
    findAll: 'findAll',
    createMany: 'createMany',
};

