import {makeGuards} from '../decorators/crud-guards/make-guards/make-guards';
import {API_METHODS_NAMES_OBJECT} from '../decorators/crud-doc/constants';
import {CrudGuardConfigOptions, CrudGuards} from '../decorators/crud-guards/interfaces/crud-guards-interfaces-types';
import {SwaggerHelper} from '../decorators/crud-doc/swagger-helpers/swagger.helper';
import {SwaggerMakers} from '../decorators/crud-doc/makers/swagger.makers';
import {CrudApiDocConfig} from '../..';
import {CrudInterceptors, CrudInterceptorsConfig} from '../decorators/crud-interceptors/interfaces/crud-interceptors';
import {makeInterceptors} from '../decorators/crud-interceptors/make-interceptors/make-interceptors';
import {CrudHeadersConfig, HeaderInterface} from '../decorators/crud-headers/interfaces/header.interface';
import {CrudMethod} from '../decorators/crud-doc/interfaces';
import {makeHeaders} from '../decorators/crud-headers/make-headers/make-headers';
import {CrudMethodsInterface} from '../interfaces/crud-methods.interface';

export class DecoratorHelper {
    static makeCrudGuards(
        options: CrudGuardConfigOptions,
        target: any,
    ) {
        return this.make<CrudGuards>(target, options, makeGuards);
    }

    static makeCrudDoc(
        options: CrudApiDocConfig,
        target: any,
    ) {
        const createOneOptions = options.createOne;
        const updateOneOptions = options.updateOne;
        const findAllOptions = options.findAll;
        const deleteOneOptions = options.deleteOne;
        const findOneByIdOptions = options.findOneById;
        const createManyOptions = options.createMany;
        if (createManyOptions) {
            SwaggerHelper.buildApiBody(createManyOptions, API_METHODS_NAMES_OBJECT.createMany, target);
            SwaggerMakers.setHeadersResponses(createManyOptions, API_METHODS_NAMES_OBJECT.createMany, target);
        }
        if (createOneOptions) {
            SwaggerHelper.buildApiBody(createOneOptions, API_METHODS_NAMES_OBJECT.createOne, target);
            SwaggerMakers.setHeadersResponses(createOneOptions, API_METHODS_NAMES_OBJECT.createOne, target);
        }
        if (updateOneOptions) {
            SwaggerHelper.buildApiBody(updateOneOptions, API_METHODS_NAMES_OBJECT.updateOne, target);
            SwaggerMakers.setHeadersResponses(updateOneOptions, API_METHODS_NAMES_OBJECT.updateOne, target);
        }
        if (findAllOptions) {
            if (findAllOptions.apiQuery) {
                SwaggerHelper.buildApiQuery(findAllOptions, API_METHODS_NAMES_OBJECT.findAll, target);
            }
            SwaggerMakers.setHeadersResponses(findAllOptions, API_METHODS_NAMES_OBJECT.findAll, target);
        }
        if (deleteOneOptions) {
            SwaggerMakers.setHeadersResponses(deleteOneOptions, API_METHODS_NAMES_OBJECT.deleteOne, target);
        }
        if (findOneByIdOptions) {
            SwaggerMakers.setHeadersResponses(findOneByIdOptions, API_METHODS_NAMES_OBJECT.findOneById, target);
        }
        return target;
    }

    static makeCrudInterceptors(
        options: CrudInterceptorsConfig,
        target: any,
    ) {
        return this.make<CrudInterceptors>(target, options, makeInterceptors);
    }

    static makeCrudHeaders(
        options: CrudHeadersConfig,
        target: any,
    ) {
        return this.make<HeaderInterface>(target, options, makeHeaders);
    }

    private static make<T>(
        target: any,
        options: CrudMethodsInterface,
        predicate: (methN: CrudMethod, targ: any, opts: T) => any | void
    ) {
        const methodsNames = Object.keys(options) as (keyof CrudMethodsInterface)[];
        for (const method of methodsNames) {
            const methodOptions = options[method];
            if (methodOptions) {
                predicate(API_METHODS_NAMES_OBJECT[method], target, methodOptions);
            }
        }
        return target;
    }
}
