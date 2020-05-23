import {Provider} from '@nestjs/common';
import {GOOGLE_CLOUD_STORAGE_MODULE_OPTIONS, PROVIDERS} from './constantes';
import {AsyncFactory, GoogleCloudStorageAsyncOptions, GoogleCloudStorageOptions} from './interfaces';


export class GoogleCloudStorageModuleHelper {
    static buildProviders(opciones: GoogleCloudStorageOptions): Provider[] {
        return [
            {
                provide: GOOGLE_CLOUD_STORAGE_MODULE_OPTIONS,
                useValue: opciones,
            },
            ...PROVIDERS,
        ];
    }

    static buildProvidersAsync(options: GoogleCloudStorageAsyncOptions): Provider[] {
        return [
            {
                provide: GOOGLE_CLOUD_STORAGE_MODULE_OPTIONS,
                useFactory: options.useFactory as AsyncFactory,
                inject: options.inject || [],
            },
            ...PROVIDERS,
        ];
    }
}