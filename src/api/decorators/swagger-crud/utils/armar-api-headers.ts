import {ApiHeaderOptions} from '@nestjs/swagger';
import {ParameterLocation} from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import {isNil} from 'lodash';
import {getEnumType, getEnumValues} from '@nestjs/swagger/dist/utils/enum.utils';
import {OPCIONES_HEADER_POR_DEFECTO} from '../constantes';


export function armarApiHeaders(
    options: ApiHeaderOptions
) {
    const param: ApiHeaderOptions & { in: ParameterLocation } | any = {
        name: isNil(options.name) ? OPCIONES_HEADER_POR_DEFECTO.name : options.name,
        in: 'header',
        description: options.description,
        required: options.required,
        schema: {
            type: 'string'
        }
    };

    if (options.enum) {
        const enumValues = getEnumValues(options.enum);
        param.schema = {
            enum: enumValues,
            type: getEnumType(enumValues)
        };
    }
    return param;

}