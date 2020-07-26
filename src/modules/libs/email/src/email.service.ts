import {Inject, Injectable} from '@nestjs/common';
import {EMAIL_TRANSPORTER} from './constants';
import * as Email from 'nodemailer/lib/mailer';

@Injectable()
export class EmailService {
    constructor(
        @Inject(EMAIL_TRANSPORTER)
        private mail: Email
    ) {
    }
    async sendMail(
        mailOptions: Email.Options,
    ) {
        try {
            await this.mail.sendMail(mailOptions);
        } catch (error) {
            console.error(
                {
                    error,
                    message: 'Error on send email/s',
                }
            );
        }
    }
}
