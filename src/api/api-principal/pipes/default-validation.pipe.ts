import {ArgumentMetadata, BadRequestException, PipeTransform} from '@nestjs/common';
import {plainToClass} from 'class-transformer';
import {validate} from 'class-validator';
import {BaseDTO} from '../schemas/base-dto';

export class DefaultValidationPipe implements PipeTransform {

    constructor(
        protected dto: typeof BaseDTO | (new () => any),
        protected showErrors: boolean = true,
        protected validateId?: boolean,
    ) {
    }

    async transform(value: any, metadata: ArgumentMetadata): Promise<any> {
        if (!this.dto || !this.toValidate(this.dto)) {
            return value;
        }
        const entityDto = plainToClass(this.dto, value) as object;
        const validationErrors = await validate(entityDto);
        if (validationErrors.length > 0) {
            console.error(validationErrors);
            const message: string = this.validateId ? 'Invalid id' : 'Invalid payload';
            const errorMessage = {
                message,
                errors: validationErrors,
            };
            if (!this.showErrors) delete errorMessage.errors;
            throw new BadRequestException(errorMessage);
        }
        return value;
    }

    protected toValidate(metatype: Function): boolean {
        const types: Function[] = [String, Boolean, Number, Array, Object];
        return !types.includes(metatype);
    }
}
