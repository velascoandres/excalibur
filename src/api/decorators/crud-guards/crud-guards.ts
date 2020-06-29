import {CanActivate} from '@nestjs/common';
import {isFunction} from '@nestjs/common/utils/shared.utils';
import {validateEach} from '@nestjs/common/utils/validate-each.util';
import {extendArrayMetadata} from '@nestjs/common/utils/extend-metadata.util';
import {GUARDS_METADATA} from '@nestjs/common/constants';
import {CrudMethod} from '../crud-doc/interfaces';
import {API_METHODS_NAMES_OBJECT} from '../crud-doc/constants';

export interface CrudGuardConfig {
    guards: (CanActivate | Function)[];
}

export interface CrudGuardConfigOptions {
    createOne?: CrudGuardConfig;
    updateOne?: CrudGuardConfig;
    findAll?: CrudGuardConfig;
    deleteOne?: CrudGuardConfig;
    findOneById?: CrudGuardConfig;
}


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

export function CrudGuards(
    options: CrudGuardConfigOptions,
): ClassDecorator {
    return (target: any) => {
        const createOneOptions = options.createOne;
        const updateOneOptions = options.updateOne;
        const findAllOptions = options.findAll;
        const deleteOneOptions = options.deleteOne;
        const findOneByIdOptions = options.findOneById;
        if (createOneOptions && options.createOne) {
            makeGuards(API_METHODS_NAMES_OBJECT.createOne, target, options.createOne.guards);
        }
        if (updateOneOptions && options.updateOne) {
            makeGuards(API_METHODS_NAMES_OBJECT.updateOne, target, options.updateOne.guards);
        }
        if (findAllOptions && options.findAll) {
            makeGuards(API_METHODS_NAMES_OBJECT.findAll, target, options.findAll.guards);
        }
        if (deleteOneOptions && options.deleteOne) {
            makeGuards(API_METHODS_NAMES_OBJECT.deleteOne, target, options.deleteOne?.guards);
        }
        if (findOneByIdOptions && options.findOneById) {
            makeGuards(API_METHODS_NAMES_OBJECT.findOneById, target, options.findOneById?.guards);
        }
        return target;
    };
}