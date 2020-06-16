import {Prototipo} from '../interfaces';
import {ApiHeaderOptions, ApiResponseOptions} from '@nestjs/swagger';
import {SwaggerHelper} from '../swagger-helpers/swagger.helper';

export function delegateApiHeader(
    nombreMetodo: string,
    target: Prototipo,
): (cg: ApiHeaderOptions) => void {
    return (configuracion: ApiHeaderOptions) => {
        SwaggerHelper.buildApiHeaders(configuracion, nombreMetodo, target);
    };
}