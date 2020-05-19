import {ApiBodyOptions} from '@nestjs/swagger';
import {getTypeIsArrayTuple} from '@nestjs/swagger/dist/decorators/helpers';
import {omit} from 'lodash';
import {addEnumArraySchema, addEnumSchema, isEnumArray, isEnumDefined} from '@nestjs/swagger/dist/utils/enum.utils';
import {ApiBodyMetadata} from '../interfaces';

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