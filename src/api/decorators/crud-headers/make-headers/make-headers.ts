import {HeaderInterface} from '../interfaces/header.interface';
import {extendArrayMetadata} from '@nestjs/common/utils/extend-metadata.util';
import {HEADERS_METADATA} from '@nestjs/common/constants';
import {CrudMethod} from '../../crud-doc/interfaces';

export function makeHeaders(
    methodName: CrudMethod,
    target: any,
    options: HeaderInterface,
) {
    extendArrayMetadata(HEADERS_METADATA, [options], target.prototype[methodName],);
    return target;
}