import {armarApiBodyCustomizado} from '../utils/armar-api-body-customizado';
import {BaseConfig, CreateUpdateOneConfig, Prototipo} from '../interfaces';
import {DECORATORS} from '@nestjs/swagger/dist/constants';
import {BODY_METADATA_POR_DEFECTO, OPCIONES_HEADER_POR_DEFECTO, OPCIONES_QUERY_POR_DEFECTO} from '../constantes';
import {isUndefined, negate, pickBy} from 'lodash';
import {ApiHeaderOptions, ApiQueryOptions, ApiResponseOptions} from '@nestjs/swagger';
import {armarApiQueryCustomizado} from '../utils/armar-api-query-customizado';
import {armarApiResponse} from '../utils/armar-api-response';
import {armarApiHeaders} from '../utils/armar-api-headers';

export class SwaggerHelper {
    static buildApiBody(
        configuracion: CreateUpdateOneConfig,
        nombreMetodo: string,
        target: Prototipo,
    ): void {
        const params = armarApiBodyCustomizado(configuracion.apiBody);
        const parametros = Reflect.getMetadata(
            DECORATORS.API_PARAMETERS,
            target.prototype[nombreMetodo]
        ) || [];
        Reflect.defineMetadata(
            DECORATORS.API_PARAMETERS,
            [
                ...parametros,
                {
                    ...BODY_METADATA_POR_DEFECTO,
                    ...pickBy(params, negate(isUndefined))
                }
            ],
            target.prototype[nombreMetodo]
        );
    }

    static buildApiQuery(
        configuracion: BaseConfig,
        nombreMetodo: string,
        target: Prototipo,
    ): void {
        const params = armarApiQueryCustomizado(configuracion.apiQuery as ApiQueryOptions);
        const parametros = Reflect.getMetadata(
            DECORATORS.API_PARAMETERS,
            target.prototype[nombreMetodo]) || [];
        Reflect.defineMetadata(
            DECORATORS.API_PARAMETERS,
            [
                ...parametros,
                {
                    ...OPCIONES_QUERY_POR_DEFECTO,
                    ...pickBy(params, negate(isUndefined))
                }
            ],
            target.prototype[nombreMetodo]
        );
    }

    static buildApiResponse(
        configuracion: ApiResponseOptions,
        nombreMetodo: string,
        target: Prototipo,
    ) {
        const params = armarApiResponse(configuracion);
        const responses = Reflect.getMetadata(
            DECORATORS.API_RESPONSE,
            target.prototype[nombreMetodo]) || {};
        Reflect.defineMetadata(
            DECORATORS.API_RESPONSE,
            {
                ...responses,
                ...params
            },
            target.prototype[nombreMetodo]
        );
    }
    static buildApiHeaders(
        configuracion: ApiHeaderOptions,
        nombreMetodo: string,
        target: Prototipo,
    ) {
        const params = armarApiHeaders(configuracion);
        const responses = Reflect.getMetadata(
            DECORATORS.API_PARAMETERS,
            target.prototype[nombreMetodo]) || [];
        Reflect.defineMetadata(
            DECORATORS.API_PARAMETERS,
            // {
            //     ...responses,
            //     ...metaData
            // },
            [
                ...responses,
                {
                    ...OPCIONES_HEADER_POR_DEFECTO,
                    ...pickBy(params, negate(isUndefined))
                }
            ],
            target.prototype[nombreMetodo]
        );
    }
}