import {ApiBodyOptions} from '@nestjs/swagger';
import {armarApiBodyCustomizado} from './utils/armar-api-body-customizado';
import {CrudApiConfig} from './interfaces';


export function CrudApiBody(
    options: CrudApiConfig,
) {
    const configuraciones = Object.values(options);
    const llaves = Object.keys(options);
    configuraciones.forEach(
        (configuracion: ApiBodyOptions, indice: number) => {
            const nombreMetodo: string = llaves[indice];
            armarApiBodyCustomizado(configuracion, nombreMetodo);
        }
    )
}