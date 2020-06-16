import {ApiBodyMetadata, MetodosApi} from './interfaces';
import {ApiHeaderOptions, ApiQueryOptions} from '@nestjs/swagger';

export const BODY_METADATA_POR_DEFECTO: ApiBodyMetadata = {
    type: String,
    required: true,
};

export const OPCIONES_QUERY_POR_DEFECTO: ApiQueryOptions = {
    name: '',
    required: true
};

export const OPCIONES_HEADER_POR_DEFECTO: Partial<ApiHeaderOptions> = {
    name: '',
};

export const NOMBRES_METODOS_API: MetodosApi = {
    createOne: 'createOne',
    updateOne: 'updateOne',
    deleteOne: 'deleteOne',
    findOneById: 'findOneById',
    findAll: 'findAll'
}