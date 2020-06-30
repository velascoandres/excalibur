import {makeGuards} from '../decorators/crud-guards/make-guards/make-guards';
import {API_METHODS_NAMES_OBJECT} from '../decorators/crud-doc/constants';
import {CrudGuardConfigOptions} from '../decorators/crud-guards/interfaces/crud-guards-interfaces-types';
import {SwaggerHelper} from '../decorators/crud-doc/swagger-helpers/swagger.helper';
import {SwaggerMakers} from '../decorators/crud-doc/makers/swagger.makers';
import {CrudApiDocConfig} from '../..';

export class DecoratorHelper {
    static setCrudGuards(
        options: CrudGuardConfigOptions,
        target: any,
    ){
        const createOneOptions = options.createOne;
        const updateOneOptions = options.updateOne;
        const findAllOptions = options.findAll;
        const deleteOneOptions = options.deleteOne;
        const findOneByIdOptions = options.findOneById;
        if (createOneOptions && options.createOne) {
            makeGuards(API_METHODS_NAMES_OBJECT.createOne, target, options.createOne);
        }
        if (updateOneOptions && options.updateOne) {
            makeGuards(API_METHODS_NAMES_OBJECT.updateOne, target, options.updateOne);
        }
        if (findAllOptions && options.findAll) {
            makeGuards(API_METHODS_NAMES_OBJECT.findAll, target, options.findAll);
        }
        if (deleteOneOptions && options.deleteOne) {
            makeGuards(API_METHODS_NAMES_OBJECT.deleteOne, target, options.deleteOne);
        }
        if (findOneByIdOptions && options.findOneById) {
            makeGuards(API_METHODS_NAMES_OBJECT.findOneById, target, options.findOneById);
        }
        return target;
    }
    static setCrudDoc(
        options: CrudApiDocConfig,
        target: any,
    ){
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
}