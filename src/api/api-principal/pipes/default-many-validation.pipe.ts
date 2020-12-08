import {DefaultValidationPipe} from './default-validation.pipe';
import {ArgumentMetadata, BadRequestException} from '@nestjs/common';
import {validateMany} from '../../shared-utils/validate-many';

export class DefaultManyValidationPipe extends DefaultValidationPipe {

    async transform(value: any, metadata: ArgumentMetadata): Promise<any> {
        if (!this.dto || !this.toValidate(this.dto)) {
            return value;
        }
        const validationErrors = await validateMany(value, this.dto);
        if (validationErrors.length > 0) {
            console.error(validationErrors);
            throw new BadRequestException({message: 'Invalid payload'});
        }
        return value;
    }
}
