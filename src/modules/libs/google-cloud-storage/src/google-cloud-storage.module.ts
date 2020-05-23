import {DynamicModule, Module} from '@nestjs/common';
import {GoogleCloudStorageModuleHelper} from './google-cloud-storage-module.helper';
import {GoogleCloudStorageAsyncOptions, GoogleCloudStorageOptions} from './interfaces';
import {PROVIDERS} from './constantes';

@Module({})
export class GoogleCloudStorageModule {
    static register(options: GoogleCloudStorageOptions): DynamicModule {
        return {
            module: GoogleCloudStorageModule,
            providers: GoogleCloudStorageModuleHelper.buildProviders(options),
            exports: [...PROVIDERS],
        }
    }

    static registerAsync(options: GoogleCloudStorageAsyncOptions): DynamicModule {
        return {
            module: GoogleCloudStorageModule,
            providers: GoogleCloudStorageModuleHelper.buildProvidersAsync(options),
            exports: [...PROVIDERS],
        }
    }
}
