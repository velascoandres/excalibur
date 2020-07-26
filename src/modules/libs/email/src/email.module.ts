import {DynamicModule, Module} from '@nestjs/common';
import {EmailModuleOptions} from './interfaces';
import {EmailPrincipalModule} from './email.principal.module';

@Module({})
export class EmailModule {
    static register(options: EmailModuleOptions): DynamicModule {
        return {
            module: EmailModule,
            imports: [
                EmailPrincipalModule.register(options),
            ],
        };
    }
}
