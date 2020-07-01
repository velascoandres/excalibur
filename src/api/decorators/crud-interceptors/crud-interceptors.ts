import {CrudInterceptorsConfig} from './interfaces/crud-interceptors';
import {DecoratorHelper} from '../../..';

export function CrudInterceptors(
    options: CrudInterceptorsConfig,
) {
    return (target: any) => {
        target = DecoratorHelper.makeCrudInterceptors(options, target);
        return target;
    };
}