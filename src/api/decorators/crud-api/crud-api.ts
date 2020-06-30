import {CrudApiDocConfig} from '../../..';
import {CrudConfig} from './interfaces/interfaces-types';
import {CrudGuardConfigOptions} from '../crud-guards/interfaces/crud-guards-interfaces-types';
import {DecoratorHelper} from '../../..';
import {transformDict} from '../../shared-utils/transform-dict';


// General Decorator, can define guards, documentation, interceptors and headers for the crud methods
export function CrudApi(
    options: CrudConfig,
): ClassDecorator {
    return (target: any) => {
        const guardsConfig = transformDict<CrudGuardConfigOptions>(options, 'guards');
        const crudApiConfig = transformDict<CrudApiDocConfig>(options, 'documentation');
        // Build Guards
        target = DecoratorHelper.makeCrudDoc(crudApiConfig, target);
        // Build ApiDoc
        target = DecoratorHelper.makeCrudGuards(guardsConfig, target);
        // Build Interceptors
        // Build Headers
        return target;
    };
}