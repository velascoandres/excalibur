import {CrudApiDocConfig} from '../../..';
import {CrudConfig} from './interfaces/interfaces-types';
import {CrudGuardConfigOptions} from '../crud-guards/interfaces/crud-guards-interfaces-types';
import {DecoratorHelper} from '../../..';
import {transformDict} from '../../shared-utils/transform-dict';
import {CrudInterceptorsConfig} from '../crud-interceptors/interfaces/crud-interceptors';


// General Decorator which can define guards, documentation, interceptors and headers for the crud methods
export function CrudApi(
    options: CrudConfig,
): ClassDecorator {
    return (target: any) => {
        const guardsConfig = transformDict<CrudGuardConfigOptions>(options, 'guards');
        const crudApiConfig = transformDict<CrudApiDocConfig>(options, 'documentation');
        const crudInterceptorsConfig = transformDict<CrudInterceptorsConfig>(options, 'interceptors');
        // Build Guards
        target = DecoratorHelper.makeCrudDoc(crudApiConfig, target);
        // Build ApiDoc
        target = DecoratorHelper.makeCrudGuards(guardsConfig, target);
        // Build Interceptors
        target =  DecoratorHelper.makeCrudInterceptors(crudInterceptorsConfig, target);
        // Build Headers
        return target;
    };
}