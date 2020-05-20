import {CrudApiConfig, MetodoCrud} from './interfaces';
import {SwaggerHelper} from './swagger-helpers/swagger.helper';
import {NOMBRES_METODOS_API} from './constantes';
import {establecerApiResponses} from './utils/establecer-api-responses';

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
            establecerApiResponses(createOneOptions.responses, target, NOMBRES_METODOS_API.createOne as MetodoCrud);
        }
        if (updateOneOptions) {
            SwaggerHelper.buildApiBody(updateOneOptions, NOMBRES_METODOS_API.updateOne, target);
            establecerApiResponses(updateOneOptions.responses, target, NOMBRES_METODOS_API.updateOne as MetodoCrud);
        }
        if (findAllOptions) {
            SwaggerHelper.buildApiQuery(findAllOptions, NOMBRES_METODOS_API.findAll, target);
            establecerApiResponses(findAllOptions.responses, target, NOMBRES_METODOS_API.findAll as MetodoCrud);
        }
        if (deleteOneOptions) {
            establecerApiResponses(deleteOneOptions.responses, target, NOMBRES_METODOS_API.deleteOne as MetodoCrud);
        }
        if (findOneByIdOptions) {
            establecerApiResponses(findOneByIdOptions.responses, target, NOMBRES_METODOS_API.findOneById as MetodoCrud);
        }
        return target;
    }
}
