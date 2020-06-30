import {CrudMethodOptionsKeys} from '../decorators/crud-api/interfaces/interfaces-types';

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