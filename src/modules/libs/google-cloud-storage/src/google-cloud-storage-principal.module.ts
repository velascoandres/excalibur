import {DynamicModule, Global, Module} from '@nestjs/common';
import {PROVIDERS} from './constantes';
import {GoogleCloudStorageAsyncOptions, GoogleCloudStorageOptions} from './interfaces';
import {GoogleCloudStorageModuleHelper} from './google-cloud-storage-module.helper';

@Global()
@Module({
    providers: [...PROVIDERS],
    exports: [...PROVIDERS],
})
export class GoogleCloudStoragePrincipalModule {
    static register(options: GoogleCloudStorageOptions): DynamicModule {
        return {
            module: GoogleCloudStoragePrincipalModule,
            providers: GoogleCloudStorageModuleHelper.buildProviders(options),
            exports: [...PROVIDERS],
        }
    }

    static registerAsync(options: GoogleCloudStorageAsyncOptions): DynamicModule {
        return {
            module: GoogleCloudStoragePrincipalModule,
            providers: GoogleCloudStorageModuleHelper.buildProvidersAsync(options),
            exports: [...PROVIDERS],
        }
    }
}