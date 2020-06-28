import {Prototype} from '../interfaces';
import {ApiHeaderOptions, ApiResponseOptions} from '@nestjs/swagger';
import {SwaggerHelper} from '../swagger-helpers/swagger.helper';

export class SwagerDelegator {
    static delegateApiResponseCB(
        methodName: string,
        target: Prototype,
    ): (cg: ApiResponseOptions) => void {
        return (configObject: ApiResponseOptions) => {
            SwaggerHelper.buildApiResponse(configObject, methodName, target);
        };
    }

   static delegateApiHeaderCB(
        methodName: string,
        target: Prototype,
    ): (cg: ApiHeaderOptions) => void {
        return (configObject: ApiHeaderOptions) => {
            SwaggerHelper.buildApiHeaders(configObject, methodName, target);
        };
    }
}