import {registerDecorator, ValidationOptions, ValidationArguments} from 'class-validator';
import {
    TypesValidator,
} from './types-collection.interface';


export function IsTypeOr(
    validations: TypesValidator,
    validationOptions?: ValidationOptions,
) {
    return (object: Object, propertyName: string) => {
        const validationsKeys = Object.keys(validations);
        registerDecorator({
            name: 'wrongType',
            target: object.constructor,
            propertyName,
            options: validationOptions,
            validator: {
                validate(value: any, args: ValidationArguments) {
                    return validationsKeys.some(key => validations[key](value));
                },
                defaultMessage(validationArguments?: ValidationArguments) {
                    const lastIndex = validationsKeys.length - 1;
                    const lastType = validationsKeys[lastIndex];
                    if (validationsKeys.length === 0)
                        return `Has to be ${lastType}`;
                    return `Can only be ${validationsKeys.join(', ')} or ${lastType}.`;
                }
            }
        });
    };
}
