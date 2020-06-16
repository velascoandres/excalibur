import {ApiHeaderOptions} from '@nestjs/swagger';
import {MetodoCrud, Prototipo} from '../interfaces';
import {delegateApiHeader} from '../callbacks/cd-delegate-api-header';

export function establecerApiHeaders(
    configuracionesRespuesta: ApiHeaderOptions[] | undefined,
    target: Prototipo,
    nombreMetodo: MetodoCrud,
): void {
    if (configuracionesRespuesta && configuracionesRespuesta.length > 0) {
        configuracionesRespuesta.forEach(
            delegateApiHeader(nombreMetodo, target),
        );
    }
}