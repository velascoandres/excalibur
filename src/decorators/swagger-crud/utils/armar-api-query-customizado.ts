import {ApiQueryOptions} from '@nestjs/swagger';
import {ApiQueryMetadata} from '../interfaces';
import {getTypeIsArrayTuple} from '@nestjs/swagger/dist/decorators/helpers';
import {OPCIONES_QUERY_POR_DEFECTO} from '../constantes';
import {isNil, omit} from 'lodash';
import {addEnumArraySchema, addEnumSchema, isEnumArray, isEnumDefined} from '@nestjs/swagger/dist/utils/enum.utils';

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