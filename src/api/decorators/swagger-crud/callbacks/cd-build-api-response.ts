import {SwaggerHelper} from '../swagger-helpers/swagger.helper';
import {Prototipo} from '../interfaces';
import {ApiResponseOptions} from '@nestjs/swagger';

export function delegarApiResponse(
    nombreMetodo: string,
    target: Prototipo,
): (cg: ApiResponseOptions) => void {
    return (configuracion: ApiResponseOptions) => {
        SwaggerHelper.buildApiResponse(configuracion, nombreMetodo, target);
    };
}