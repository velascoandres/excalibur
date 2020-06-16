import {CrudApiConfig} from './interfaces';
import {SwaggerHelper} from './swagger-helpers/swagger.helper';
import {NOMBRES_METODOS_API} from './constantes';
import {setHeadersAndResponses} from './utils/setHeadersAndResponses';

// Implementacion del decorador ApiDoc
// Este decorador sirve para generar la documentacion de la API para los metodos -> Crud
export function ApiDoc(
    options: CrudApiConfig,
) {
    return (target: any) => {
        const createOneOptions = options.createOne;
        const updateOneOptions = options.updateOne;
        const findAllOptions = options.findAll;
        const deleteOneOptions = options.deleteOne;
        const findOneByIdOptions = options.findOneById;
        if (createOneOptions) {
            SwaggerHelper.buildApiBody(createOneOptions, NOMBRES_METODOS_API.createOne, target);
            setHeadersAndResponses(createOneOptions, NOMBRES_METODOS_API.createOne, target);
        }
        if (updateOneOptions) {
            SwaggerHelper.buildApiBody(updateOneOptions, NOMBRES_METODOS_API.updateOne, target);
            setHeadersAndResponses(updateOneOptions, NOMBRES_METODOS_API.updateOne, target);
        }
        if (findAllOptions) {
            if (findAllOptions.apiQuery) {
                SwaggerHelper.buildApiQuery(findAllOptions, NOMBRES_METODOS_API.findAll, target);
            }
            setHeadersAndResponses(findAllOptions, NOMBRES_METODOS_API.findAll, target);
        }
        if (deleteOneOptions) {
            setHeadersAndResponses(deleteOneOptions, NOMBRES_METODOS_API.deleteOne, target);
        }
        if (findOneByIdOptions) {
            setHeadersAndResponses(findOneByIdOptions, NOMBRES_METODOS_API.findOneById, target);
        }
        return target;
    };
}
