import {ApiBodyOptions, ApiQueryOptions} from '@nestjs/swagger';
import {getTypeIsArrayTuple} from '@nestjs/swagger/dist/decorators/helpers';
import {omit, isNil} from 'lodash';
import {addEnumArraySchema, addEnumSchema, isEnumArray, isEnumDefined} from '@nestjs/swagger/dist/utils/enum.utils';
import {ApiBodyMetadata, ApiQueryMetadata} from '../interfaces';
import {OPCIONES_QUERY_POR_DEFECTO} from '../constantes';

export function armarApiBodyCustomizado(options: ApiBodyOptions) {
    const [type, isArray] = getTypeIsArrayTuple(
        (options as ApiBodyMetadata).type,
        (options as ApiBodyMetadata).isArray as boolean
    );
    const param: ApiBodyMetadata & Record<string, any> = {
        in: 'body',
        ...omit(options, 'enum'),
        type,
        isArray
    };

    if (isEnumArray(options)) {
        addEnumArraySchema(param, options);
    } else if (isEnumDefined(options)) {
        addEnumSchema(param, options);
    }
    return  param;
}

export function armarApiQueryCustomizado(options: ApiQueryOptions) {
    const apiQueryMetadata = options as ApiQueryMetadata;
    const [type, isArray] = getTypeIsArrayTuple(
        apiQueryMetadata.type,
        apiQueryMetadata.isArray as boolean
    );
    const nombre = OPCIONES_QUERY_POR_DEFECTO.name;
    const param: ApiQueryMetadata & Record<string, any> = {
        // @ts-ignore
        name: isNil(options.name) ? nombre : options.name,
        in: 'query',
        ...omit(options, 'enum'),
        type,
        isArray
    };

    if (isEnumArray(options)) {
        addEnumArraySchema(param, options);
    } else if (isEnumDefined(options)) {
        addEnumSchema(param, options);
    }
    return param;
}