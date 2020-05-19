import {DECORATORS} from '@nestjs/swagger/dist/constants';
import {isUndefined, negate, pickBy} from 'lodash';

export function crearDecoradorParametro<T extends Record<string, any> = any>(
    metadata: T,
    initial: Partial<T>,
    nombreMetodo: string,
): ClassDecorator {
    console.log('metadata',metadata);
    console.log('initial', initial);
    return (
        target: any,
    ) => {
        console.log(target.prototype[nombreMetodo]);
        const parametros =
            Reflect.getMetadata(DECORATORS.API_PARAMETERS, target.prototype[nombreMetodo]) || [];
        console.log('parametros', parametros);
        Reflect.defineMetadata(
            DECORATORS.API_PARAMETERS,
            [
                ...parametros,
                {
                    ...initial,
                    ...pickBy(metadata, negate(isUndefined))
                }
            ],
            target.prototype[nombreMetodo]
        );
        return target;
    };
}