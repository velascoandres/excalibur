import {CrudApiConfig} from './interfaces';
import {SwaggerHelper} from './swagger-helpers/swagger.helper';
import {delegarApiResponse} from './callbacks/cd-build-api-response';
import {NOMBRES_METODOS_API} from './constantes';


export function ApiDoc(
    options: CrudApiConfig,
) {
    return (target: any) => {
        const createOneOptions = options.createOne;
        const updateOneOptions = options.updateOne;
        const findAllOptions = options.findAll;
        if (createOneOptions) {
            SwaggerHelper.buildApiBody(createOneOptions, NOMBRES_METODOS_API.createOne, target);
            const condiguracionesRespuesta = createOneOptions.responses;
            if (condiguracionesRespuesta && condiguracionesRespuesta.length > 0) {
                condiguracionesRespuesta.forEach(
                    delegarApiResponse(NOMBRES_METODOS_API.createOne, target),
                );
            }
        }
        if (updateOneOptions) {
            SwaggerHelper.buildApiBody(updateOneOptions, NOMBRES_METODOS_API.updateOne, target);
            const condiguracionesRespuesta = updateOneOptions.responses;
            if (condiguracionesRespuesta && condiguracionesRespuesta.length > 0) {
                condiguracionesRespuesta.forEach(
                    delegarApiResponse(NOMBRES_METODOS_API.updateOne, target),
                );
            }
        }
        if (findAllOptions) {
            SwaggerHelper.buildApiQuery(findAllOptions, NOMBRES_METODOS_API.findAll, target);
            const condiguracionesRespuesta = findAllOptions.responses;
            if (condiguracionesRespuesta && condiguracionesRespuesta.length > 0) {
                condiguracionesRespuesta.forEach(
                    delegarApiResponse(NOMBRES_METODOS_API.findAll, target),
                );
            }
        }
        return target;
    }
}
