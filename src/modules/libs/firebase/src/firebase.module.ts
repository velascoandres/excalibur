import {Module} from '@nestjs/common';
import {FirebaseModuleOptions} from './interfaces';
import {FirebasePrincipalModule} from './firebase-principal.module';

@Module({})
export class FirebaseModule {
    static register(
        options: FirebaseModuleOptions,
    ) {
        return FirebasePrincipalModule.register(options);
    }
}
