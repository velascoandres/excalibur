import {
    ApiBodyOptions,
    ApiHeaderOptions, ApiParamOptions,
    ApiQueryOptions,
    ApiResponseMetadata,
    ApiResponseOptions
} from '@nestjs/swagger';
import {ParameterLocation, SchemaObject} from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import {isNil, omit} from 'lodash';
import {DEFAULT_HEADER_OPTIONS, DEFAULT_PARAM_OPTIONS, DEFAULT_QUERY_OPTIONS} from '../constants';
import {
    addEnumArraySchema, addEnumSchema,
    getEnumType,
    getEnumValues,
    isEnumArray,
    isEnumDefined
} from '@nestjs/swagger/dist/utils/enum.utils';
import {getTypeIsArrayTuple} from '@nestjs/swagger/dist/decorators/helpers';
import {ApiBodyMetadata, ApiParamMetadata, ApiQueryMetadata, BaseConfig, CrudMethod, Prototype} from '../interfaces';
import {SwagerDelegator} from '../delegators/swager.delegator';


export class SwaggerMakers {
    static makeApiHeaders(
        options: ApiHeaderOptions
    ) {
        const param: ApiHeaderOptions & { in: ParameterLocation } | any = {
            name: isNil(options.name) ? DEFAULT_HEADER_OPTIONS.name : options.name,
            in: 'header',
            description: options.description,
            required: options.required,
            schema: {
                type: 'string'
            }
        };

        if (options.enum) {
            const enumValues = getEnumValues(options.enum);
            param.schema = {
                enum: enumValues,
                type: getEnumType(enumValues)
            };
        }
        return param;

    }

    static makeApiResponse(
        options: ApiResponseOptions
    ) {
        const [type, isArray] = getTypeIsArrayTuple(
            (options as ApiResponseMetadata).type,
            (options as ApiResponseMetadata).isArray as boolean
        );

        (options as ApiResponseMetadata).type = type;
        (options as ApiResponseMetadata).isArray = isArray;
        options.description = options.description ? options.description : '';

        return {[options.status as any]: omit(options, 'status')};
    }

    static makeCustomApiBody(options: ApiBodyOptions) {
        const [type, isArray] = getTypeIsArrayTuple(
            (options as ApiBodyMetadata).type,
            (options as ApiBodyMetadata).isArray as boolean
        );
        const param: ApiBodyMetadata & Record<string, any> = {
            in: 'body',
            ...omit(options, 'enum'),
            type,
            isArray
        };

        if (isEnumArray(options)) {
            addEnumArraySchema(param, options);
        } else if (isEnumDefined(options)) {
            addEnumSchema(param, options);
        }
        return param;
    }

    static makeApiParam(
        options: ApiParamOptions
    ) {
        const param: Record<string, any> = {
            in: 'path',
            ...omit(options, 'enum'),
            name: isNil(options.name) ? DEFAULT_PARAM_OPTIONS.name : options.name,
        };

        const apiParamMetadata = options as ApiParamMetadata;
        if (apiParamMetadata.enum) {
            param.schema = param.schema || ({} as SchemaObject);

            const paramSchema = param.schema as SchemaObject;
            const enumValues = getEnumValues(apiParamMetadata.enum);
            paramSchema.type = getEnumType(enumValues);
            paramSchema.enum = enumValues;

            if (apiParamMetadata.enumName) {
                param.enumName = apiParamMetadata.enumName;
            }
        }
        return param;
    }

    static makeCustomApiQuery(
        options: ApiQueryOptions,
    ): ApiQueryMetadata & Record<string, any> {
        const apiQueryMetadata = options as ApiQueryMetadata;
        const [type, isArray] = getTypeIsArrayTuple(
            apiQueryMetadata.type,
            apiQueryMetadata.isArray as boolean
        );
        const name = DEFAULT_QUERY_OPTIONS.name;
        const param: ApiQueryMetadata & Record<string, any> = {
            // @ts-ignore
            name: isNil(options.name) ? name : options.name,
            in: 'query',
            ...omit(options, 'enum'),
            type,
            isArray
        };

        if (isEnumArray(options)) {
            addEnumArraySchema(param, options);
        } else if (isEnumDefined(options)) {
            addEnumSchema(param, options);
        }
        return param;
    }

    static setApiHeaders(
        responsesConfigList: ApiHeaderOptions[] | undefined,
        target: Prototype,
        methodName: CrudMethod,
    ): void {
        if (responsesConfigList && responsesConfigList.length > 0) {
            responsesConfigList.forEach(
                SwagerDelegator.delegateApiHeaderCB(methodName, target),
            );
        }
    }

    static setApiResponses(
        responsesConfigList: ApiResponseOptions[] | undefined,
        target: Prototype,
        methodName: CrudMethod,
    ): void {
        if (responsesConfigList && responsesConfigList.length > 0) {
            responsesConfigList.forEach(
                SwagerDelegator.delegateApiResponseCB(methodName, target),
            );
        }
    }

    static setHeadersResponses(options: BaseConfig, methodName: CrudMethod, target: any) {
        if (options.responses && options.responses.length > 0) {
            SwaggerMakers.setApiResponses(options.responses, target, methodName);
        }
        if (options.headers && options.headers.length > 0) {
            SwaggerMakers.setApiHeaders(options.headers, target, methodName);
        }
    }
}
