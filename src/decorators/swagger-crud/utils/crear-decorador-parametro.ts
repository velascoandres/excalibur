import {DECORATORS} from '@nestjs/swagger/dist/constants';
import {isUndefined, negate, pickBy} from 'lodash';

export function crearDecoradorParametro<T extends Record<string, any> = any>(
    metadata: T,
    initial: Partial<T>,
    nombreMetodo: string,
): MethodDecorator {
    return (
        target: object,
        key: string | symbol,
        descriptor: PropertyDescriptor
    ) => {
        const parametros =
            Reflect.getMetadata(DECORATORS.API_PARAMETERS, descriptor.value, nombreMetodo) || [];
        Reflect.defineMetadata(
            DECORATORS.API_PARAMETERS,
            [
                ...parametros,
                {
                    ...initial,
                    ...pickBy(metadata, negate(isUndefined))
                }
            ],
            descriptor.value
        );
        return descriptor;
    };
}