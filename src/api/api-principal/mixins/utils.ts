import {CrudConfig} from '../../decorators/crud-api/interfaces/interfaces-types';
import {DefaultGuard} from '../guards/default.guard';
import {CrudGuards} from '../../../../lib/api/decorators/crud-guards/interfaces/crud-guards-interfaces-types';

type CrudMethodGuards = Record<keyof (CrudConfig), CrudGuards>;


export class CrudControllerUtils {
    static getGuards(options: CrudConfig): CrudMethodGuards {

        const initialGuards: CrudMethodGuards = {
            findAll: [new DefaultGuard()],
            createMany: [new DefaultGuard()],
            findOneById: [new DefaultGuard()],
            deleteOne: [new DefaultGuard()],
            updateOne: [new DefaultGuard()],
            createOne: [new DefaultGuard()],
        };

        const methodNames = Object.values(options);
        const hasConfigForCrudMethods = methodNames && methodNames.length;
        if (!hasConfigForCrudMethods) return initialGuards;
        return methodNames.reduce(
            (acc: CrudMethodGuards, methodName: keyof (CrudConfig)) => {
                const guards = options[methodName]?.guards;
                if (guards) acc[methodName] = guards;
                return acc;
            }, initialGuards,
        );
    }
}
