import {DefaultValidationPipe} from './default-validation.pipe';
import {ArgumentMetadata, BadRequestException} from '@nestjs/common';
import {validateMany} from '../../shared-utils/validate-many';
import {LoggerService} from '../services/logger.service';

export class DefaultManyValidationPipe extends DefaultValidationPipe {

    async transform(value: any, metadata: ArgumentMetadata): Promise<any> {
        if (!this.dto || !this.toValidate(this.dto)) {
            return value;
        }
        const validationErrors = await validateMany(value, this.dto);
        const logger = LoggerService.getInstance().logger;
        if (validationErrors.length > 0) {
            logger.error(validationErrors, 'DefaultManyValidationPipe');
            throw new BadRequestException({message: 'Invalid payload'});
        }
        return value;
    }
}
