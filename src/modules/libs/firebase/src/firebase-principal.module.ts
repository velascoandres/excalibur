import {FirebaseModuleOptions} from './interfaces';
import admin from 'firebase-admin';
import {DynamicModule, Global, Module} from '@nestjs/common';
import {FIREBASE_MODULE_SERVICES} from './constants';
import {FirebaseModuleHelper} from './firebase.module.helper';

@Global()
@Module({})
export class FirebasePrincipalModule {
    static register(
        options: FirebaseModuleOptions,
    ): DynamicModule {
        const initializaedApp = admin.apps.length === 0 ? admin.initializeApp(options) : admin.apps[0];
        const createdProviders = FirebaseModuleHelper.createProviders(
            FIREBASE_MODULE_SERVICES,
            initializaedApp,
        );
        return {
            module: FirebasePrincipalModule,
            providers: createdProviders,
            exports: [...FIREBASE_MODULE_SERVICES],
        };
    }
}