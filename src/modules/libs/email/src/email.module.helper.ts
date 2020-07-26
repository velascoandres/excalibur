import {GoogleCloudStorageService} from '../../google-cloud-storage/src';
import {Provider} from '@nestjs/common';
import {EMAIL_TRANSPORTER} from './constants';
import {EmailModuleOptions} from './interfaces';
import {EmailService} from './email.service';
import {createTransport} from 'nodemailer';
import * as email from 'nodemailer/lib/mailer';

export class EmailModuleHelper {
    private static get buidlFactoryprovider() {
        return {
            provide: GoogleCloudStorageService,
            useFactory: (optionsLocal: email) => new EmailService(optionsLocal),
            inject: [EMAIL_TRANSPORTER],
        };
    }

    static buildProviders(options: EmailModuleOptions): Provider[] {
        const transporter = createTransport(
            options.transport,
            options?.defaults,
        );
        const emailModuleOptionsProvider = {
            provide: EMAIL_TRANSPORTER,
            useValue: transporter,
        };

        return [
            emailModuleOptionsProvider,
            this.buidlFactoryprovider,
        ];
    }
}
