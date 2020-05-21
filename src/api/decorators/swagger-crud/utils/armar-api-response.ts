import {ApiResponseMetadata, ApiResponseOptions} from '@nestjs/swagger';
import {getTypeIsArrayTuple} from '@nestjs/swagger/dist/decorators/helpers';
import {omit} from 'lodash';


export function armarApiResponse(
    options: ApiResponseOptions
) {
    const [type, isArray] = getTypeIsArrayTuple(
        (options as ApiResponseMetadata).type,
        (options as ApiResponseMetadata).isArray as boolean
    );

    (options as ApiResponseMetadata).type = type;
    (options as ApiResponseMetadata).isArray = isArray;
    options.description = options.description ? options.description : '';

    return { [options.status as any]: omit(options, 'status') };
}
