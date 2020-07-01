import {makeGuards} from '../decorators/crud-guards/make-guards/make-guards';
import {API_METHODS_NAMES_OBJECT} from '../decorators/crud-doc/constants';
import {CrudGuardConfigOptions} from '../decorators/crud-guards/interfaces/crud-guards-interfaces-types';
import {SwaggerHelper} from '../decorators/crud-doc/swagger-helpers/swagger.helper';
import {SwaggerMakers} from '../decorators/crud-doc/makers/swagger.makers';
import {CrudApiDocConfig} from '../..';
import {CrudInterceptorsConfig} from '../decorators/crud-interceptors/interfaces/crud-interceptors';
import {makeInterceptors} from '../decorators/crud-interceptors/make-interceptors/make-interceptors';

export class DecoratorHelper {
    static makeCrudGuards(
        options: CrudGuardConfigOptions,
        target: any,
    ) {
        const createOneOptions = options.createOne;
        const updateOneOptions = options.updateOne;
        const findAllOptions = options.findAll;
        const deleteOneOptions = options.deleteOne;
        const findOneByIdOptions = options.findOneById;
        if (createOneOptions) {
            makeGuards(API_METHODS_NAMES_OBJECT.createOne, target, createOneOptions);
        }
        if (updateOneOptions) {
            makeGuards(API_METHODS_NAMES_OBJECT.updateOne, target, updateOneOptions);
        }
        if (findAllOptions) {
            makeGuards(API_METHODS_NAMES_OBJECT.findAll, target, findAllOptions);
        }
        if (deleteOneOptions) {
            makeGuards(API_METHODS_NAMES_OBJECT.deleteOne, target, deleteOneOptions);
        }
        if (findOneByIdOptions) {
            makeGuards(API_METHODS_NAMES_OBJECT.findOneById, target, findOneByIdOptions);
        }
        return target;
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
        const createOneOptions = options.createOne;
        const updateOneOptions = options.updateOne;
        const findAllOptions = options.findAll;
        const deleteOneOptions = options.deleteOne;
        const findOneByIdOptions = options.findOneById;
        if (createOneOptions) {
            makeInterceptors(API_METHODS_NAMES_OBJECT.createOne, target, createOneOptions);
        }
        if (updateOneOptions) {
            makeInterceptors(API_METHODS_NAMES_OBJECT.updateOne, target, updateOneOptions);
        }
        if (findAllOptions) {
            makeInterceptors(API_METHODS_NAMES_OBJECT.findAll, target, findAllOptions);
        }
        if (deleteOneOptions) {
            makeInterceptors(API_METHODS_NAMES_OBJECT.deleteOne, target, deleteOneOptions);
        }
        if (findOneByIdOptions) {
            makeInterceptors(API_METHODS_NAMES_OBJECT.findOneById, target, findOneByIdOptions);
        }
        return target;
    }
}