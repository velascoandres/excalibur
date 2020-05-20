import {delegarApiResponse} from '../callbacks/cd-build-api-response';
import {ApiResponseOptions} from '@nestjs/swagger';
import {MetodoCrud, Prototipo} from '../interfaces';

export function establecerApiResponses(
    configuracionesRespuesta: ApiResponseOptions[] | undefined,
    target: Prototipo,
    nombreMetodo: MetodoCrud,
): void {
    if (configuracionesRespuesta && configuracionesRespuesta.length > 0) {
        configuracionesRespuesta.forEach(
            delegarApiResponse(nombreMetodo, target),
        );
    }
}