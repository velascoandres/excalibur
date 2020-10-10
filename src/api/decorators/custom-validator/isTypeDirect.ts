import {TypesCollectionArguments, TypesCollectionInterface, ValidationFunction} from './types-collection.interface';
import {registerDecorator, ValidationArguments, ValidationOptions} from 'class-validator';

export function IsTypeDirect<Types = TypesCollectionInterface>(
    typesCollectionStrategies: TypesCollectionInterface,
    argsDic?: TypesCollectionArguments<Types>,
    validationOptions?: ValidationOptions,
) {
    const validationStrategies = Object.keys(typesCollectionStrategies);
    const hasArgsDict = !!(argsDic && Object.keys(argsDic).length > 0);
    const keys = Object.keys(typesCollectionStrategies);
    return (object: Object, propertyName: string) => {
        registerDecorator({
                name: 'incorrectType',
                target: object.constructor,
                propertyName,
                options: validationOptions,
                validator: {
                    validate(value: any, args: ValidationArguments) {
                        return validationStrategies.some(
                            (strategy: string) => {
                                const params = hasArgsDict ? (argsDic as any)[strategy] : undefined;
                                const cb: ValidationFunction = typesCollectionStrategies[strategy];
                                return cb(value, params);
                            }
                        );
                    },
                    defaultMessage(validationArguments?: ValidationArguments) {
                        const lastType = keys.pop();
                        if (keys.length === 0)
                            return `Has to be ${lastType}`;
                        return `Can only be ${keys.join(', ')} or ${lastType}.`;
                    }
                }
            },
        );
    };
}