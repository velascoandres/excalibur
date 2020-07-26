import {DynamicModule, Global, Module} from '@nestjs/common';
import {EmailModuleHelper} from './email.module.helper';
import {EmailModuleOptions} from './interfaces';
import {EmailService} from './email.service';

@Global()
@Module({
    providers: [
        EmailService,
    ],
    exports: [
        EmailService,
    ],
})
export class EmailPrincipalModule {
    static register(options: EmailModuleOptions): DynamicModule {
        return {
            module: EmailPrincipalModule,
            providers: [
                ...EmailModuleHelper.buildProviders(options),
            ],
            exports: [
                EmailService,
            ]
        };
    }
}
