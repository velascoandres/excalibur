import {CrudMethod} from '../../crud-doc/interfaces';
import {CanActivate} from '@nestjs/common';
import {isFunction} from '@nestjs/common/utils/shared.utils';
import {validateEach} from '@nestjs/common/utils/validate-each.util';
import {extendArrayMetadata} from '@nestjs/common/utils/extend-metadata.util';
import {GUARDS_METADATA} from '@nestjs/common/constants';

export function makeGuards(
    methodName: CrudMethod,
    target: any,
    guards: (CanActivate | Function)[],
) {
    const isGuardValid = <T extends Function | Record<string, any>>(guard: T) =>
        guard &&
        (isFunction(guard) ||
            isFunction((guard as Record<string, any>).canActivate));
    validateEach(target, guards, isGuardValid, '@UseGuards', 'guard');
    extendArrayMetadata(GUARDS_METADATA, guards, target.prototype[methodName]);
}