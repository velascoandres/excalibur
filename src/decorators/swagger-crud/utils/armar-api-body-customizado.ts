import {ApiBodyOptions} from '@nestjs/swagger';
import {getTypeIsArrayTuple} from '@nestjs/swagger/dist/decorators/helpers';
import {omit} from 'lodash';
import {addEnumArraySchema, addEnumSchema, isEnumArray, isEnumDefined} from '@nestjs/swagger/dist/utils/enum.utils';
import {crearDecoradorParametro} from './crear-decorador-parametro';
import {ApiBodyMetadata} from '../interfaces';
import {BODY_METADATA_POR_DEFECTO} from '../constantes';

export function armarApiBodyCustomizado(options: ApiBodyOptions, nombreMetodo: string): MethodDecorator {
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
    return crearDecoradorParametro(param, BODY_METADATA_POR_DEFECTO, nombreMetodo);
}