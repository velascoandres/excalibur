import {registerDecorator, ValidationOptions, ValidationArguments} from 'class-validator';
import {GENERIC_TYPE_VALIDATOR} from './constants';
import {
    TypesValidator,
} from './types-collection.interface';


export function IsType(
    types: TypesValidator,
    validationOptions?: ValidationOptions,
) {
    return (object: Object, propertyName: string) => {
        registerDecorator({
            name: 'wrongType',
            target: object.constructor,
            propertyName,
            options: validationOptions,
            validator: {
                validate(value: any, args: ValidationArguments) {
                    return types.some(v => GENERIC_TYPE_VALIDATOR[v](value));
                },
                defaultMessage(validationArguments?: ValidationArguments) {
                    const lastType = types.pop();
                    if (types.length === 0)
                        return `Has to be ${lastType}`;
                    return `Can only be ${types.join(', ')} or ${lastType}.`;
                }
            }
        });
    };
}
