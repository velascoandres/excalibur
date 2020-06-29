import {API_METHODS_NAMES_OBJECT} from '../crud-doc/constants';
import {CrudGuardConfigOptions} from './interfaces/crud-guards-interfaces-types';
import {makeGuards} from './make-guards/make-guards';


// Decorator who assign guards to especific CRUD method
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
    };
}