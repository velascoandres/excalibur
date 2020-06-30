import {CrudApiDocConfig, CrudGuards} from '../../..';
import {CrudConfig, CrudMethodOptionsKeys} from './interfaces/interfaces-types';
import {CrudGuardConfigOptions} from '../crud-guards/interfaces/crud-guards-interfaces-types';
import {DecoratorHelper} from '../../shared-utils/decorator-helper';


export function transformDict<T = Object>(dict: {[s: string]: any}, key: CrudMethodOptionsKeys): T {
    const keys = Object.keys(dict);
    return keys.reduce(
        (accumulator: T | any, objectKey: string) => {
            const value: any = dict[objectKey];
            if (value) {
                const subValue = value[key];
                if (subValue) {
                    accumulator[objectKey] = subValue;
                }
            }
            return accumulator;
        },
        {} as any,
    );
}


export function CrudApi(
    options: CrudConfig,
): ClassDecorator {
    return (target: any) => {
        const guardsConfig = transformDict<CrudGuardConfigOptions>(options, 'guards');
        const crudApiConfig = transformDict<CrudApiDocConfig>(options, 'documentation');
        // Build Guards
        // CrudGuards(guardsConfig)(target);
        target = DecoratorHelper.setCrudDoc(crudApiConfig, target);
        // Build ApiDoc
        // CrudApi(crudApiConfig)(target);
        target = DecoratorHelper.setCrudGuards(guardsConfig, target);
        // Build Interceptors
        // Build Headers
        return target;
    };
}