import * as SMTPTransport from 'nodemailer/lib/smtp-transport';

export interface EmailModuleOptions {
    transport: SMTPTransport | SMTPTransport.Options | string;
    defaults?: SMTPTransport.Options;
}


export interface MailBody {
    from: string;
    to: string[];
    c?: string[];
    subject?: string;
    text?: string;
    html?: string;
    attachments?: any;
}
