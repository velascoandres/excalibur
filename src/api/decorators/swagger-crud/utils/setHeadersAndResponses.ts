import {establecerApiResponses} from './establecer-api-responses';
import {BaseConfig, MetodoCrud} from '../interfaces';
import {establecerApiHeaders} from './establecer-api-headers';

export function setHeadersAndResponses(options: BaseConfig, methodname: MetodoCrud, target: any) {
    if (options.responses && options.responses.length > 0) {
        establecerApiResponses(options.responses, target, methodname);
    }
    if (options.headers && options.headers.length > 0) {
        establecerApiHeaders(options.headers, target, methodname);
    }
}