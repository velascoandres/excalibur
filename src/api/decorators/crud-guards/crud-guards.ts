import {CrudGuardConfigOptions} from './interfaces/crud-guards-interfaces-types';
import {DecoratorHelper} from '../../..';


// Decorator who assign guards to especific CRUD method
export function CrudGuards(
    options: CrudGuardConfigOptions,
): ClassDecorator {
    return (target: any) => {
        return  DecoratorHelper.makeCrudGuards(options, target);
    };
}