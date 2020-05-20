import {ApiBodyMetadata} from './interfaces';
import {ApiQueryOptions} from '@nestjs/swagger';

export const BODY_METADATA_POR_DEFECTO: ApiBodyMetadata = {
    type: String,
    required: true,
};

export const OPCIONES_QUERY_POR_DEFECTO: ApiQueryOptions = {
    name: '',
    required: true
};

export const NOMBRES_METODOS_API = {
    createOne: 'createOne',
    updateOne: 'updateOne',
    deleteOne: 'deleteOne',
    findOneById: 'findOneById',
    findAll: 'findAll'
}