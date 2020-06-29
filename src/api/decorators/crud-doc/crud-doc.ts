import {CrudApiConfig} from './interfaces';
import {SwaggerHelper} from './swagger-helpers/swagger.helper';
import {API_METHODS_NAMES_OBJECT} from './constants';
import {SwaggerMakers} from './makers/swagger.makers';

// Implementacion del decorador CrudDoc
// Este decorador sirve para generar la documentacion de la API para los metodos -> Crud
export function CrudDoc(
    options: CrudApiConfig,
) {
    return (target: any) => {
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
    };
}
