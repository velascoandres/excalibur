import {
    BaseConfig, CreateOneConfig,
    DeleteOneConfig,
    FindOneByIdConfig,
    Prototype,
    UpdateOneConfig
} from '../interfaces';
import {DECORATORS} from '@nestjs/swagger/dist/constants';
import {
    DEFAULT_BODY_METADATA,
    DEFAULT_HEADER_OPTIONS,
    DEFAULT_PARAM_OPTIONS,
    DEFAULT_QUERY_OPTIONS
} from '../constants';
import {isUndefined, negate, pickBy} from 'lodash';
import {ApiHeaderOptions, ApiParamOptions, ApiQueryOptions, ApiResponseOptions} from '@nestjs/swagger';
import {SwaggerMakers} from '../makers/swagger.makers';

export class SwaggerHelper {

    static buidlApiParameters(
        configObject: DeleteOneConfig | UpdateOneConfig | FindOneByIdConfig,
        methodName: string,
        target: any,
    ) {
        const params = SwaggerMakers.makeApiParam(configObject.param || ({} as ApiParamOptions));
        const metadataValue = Reflect.getMetadata(
            DECORATORS.API_PARAMETERS,
            target.prototype[methodName],
        ) || [];
        Reflect.defineMetadata(
            DECORATORS.API_PARAMETERS,
            [
                ...metadataValue,
                {
                    ...DEFAULT_PARAM_OPTIONS,
                    ...pickBy(params, negate(isUndefined))
                }
            ],
            target.prototype[methodName],
        );
    }

    static buildApiBody(
        configObject: CreateOneConfig,
        methodName: string,
        target: any,
    ): void {
        const params = SwaggerMakers.makeCustomApiBody(configObject.apiBody);
        const metadataValue = Reflect.getMetadata(
            DECORATORS.API_PARAMETERS,
            target.prototype[methodName],
        ) || [];
        Reflect.defineMetadata(
            DECORATORS.API_PARAMETERS,
            [
                ...metadataValue,
                {
                    ...DEFAULT_BODY_METADATA,
                    ...pickBy(params, negate(isUndefined))
                }
            ],
            target.prototype[methodName],
        );
    }

    static buildApiQuery(
        configObject: BaseConfig,
        methodName: string,
        target: Prototype,
    ): void {
        const params = SwaggerMakers.makeCustomApiQuery(configObject.apiQuery as ApiQueryOptions);
        const metadataValue = Reflect.getMetadata(
            DECORATORS.API_PARAMETERS,
            target.prototype[methodName]) || [];
        Reflect.defineMetadata(
            DECORATORS.API_PARAMETERS,
            [
                ...metadataValue,
                {
                    ...DEFAULT_QUERY_OPTIONS,
                    ...pickBy(params, negate(isUndefined))
                }
            ],
            target.prototype[methodName],
        );
    }

    static buildApiResponse(
        configObject: ApiResponseOptions,
        methodName: string,
        target: Prototype,
    ) {
        const params = SwaggerMakers.makeApiResponse(configObject);
        const metadataValue = Reflect.getMetadata(
            DECORATORS.API_RESPONSE,
            target.prototype[methodName]) || {};
        Reflect.defineMetadata(
            DECORATORS.API_RESPONSE,
            {
                ...metadataValue,
                ...params
            },
            target.prototype[methodName],
        );
    }

    static buildApiHeaders(
        configObject: ApiHeaderOptions,
        methodName: string,
        target: Prototype,
    ) {
        const params = SwaggerMakers.makeApiHeaders(configObject);
        const metadataValue = Reflect.getMetadata(
            DECORATORS.API_PARAMETERS,
            target.prototype[methodName]) || [];
        Reflect.defineMetadata(
            DECORATORS.API_PARAMETERS,
            [
                ...metadataValue,
                {
                    ...DEFAULT_HEADER_OPTIONS,
                    ...pickBy(params, negate(isUndefined))
                }
            ],
            target.prototype[methodName],
        );
    }
}
