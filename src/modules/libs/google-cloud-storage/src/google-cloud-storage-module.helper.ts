import {Provider} from '@nestjs/common';
import {GOOGLE_CLOUD_STORAGE_MODULE_OPTIONS, PROVIDERS} from './constantes';
import {AsyncFactory, GoogleCloudStorageAsyncOptions, GoogleCloudStorageOptions} from './interfaces';
import {GoogleCloudStorageService} from './google-cloud-storage.service';


export class GoogleCloudStorageModuleHelper {

    private static get buidlFactoryprovider() {
        return {
            provide: GoogleCloudStorageService,
            useFactory: (optionsLocal: GoogleCloudStorageOptions) => new GoogleCloudStorageService(optionsLocal),
            inject: [GOOGLE_CLOUD_STORAGE_MODULE_OPTIONS],
        };
    }

    static buildProviders(options: GoogleCloudStorageOptions): Provider[] {
        const googleCloudStorageModuleOptionsProvider = {
            provide: GOOGLE_CLOUD_STORAGE_MODULE_OPTIONS,
            useValue: options,
        };

        return [
            googleCloudStorageModuleOptionsProvider,
            this.buidlFactoryprovider,
        ];
    }

    static buildProvidersAsync(options: GoogleCloudStorageAsyncOptions): Provider[] {
        return [
            {
                provide: GOOGLE_CLOUD_STORAGE_MODULE_OPTIONS,
                useFactory: options.useFactory as AsyncFactory,
                inject: options.inject || [],
            },
            this.buidlFactoryprovider,
        ];
    }
}