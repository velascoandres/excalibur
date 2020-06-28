import {DynamicModule, Module} from '@nestjs/common';
import {GoogleCloudStorageAsyncOptions, GoogleCloudStorageOptions} from './interfaces';
import {GoogleCloudStoragePrincipalModule} from './google-cloud-storage-principal.module';

@Module({})
export class GoogleCloudStorageModule {
    static register(options: GoogleCloudStorageOptions): DynamicModule {
        return {
            module: GoogleCloudStorageModule,
            imports: [GoogleCloudStoragePrincipalModule.register(options)],
        };
    }

    static registerAsync(options: GoogleCloudStorageAsyncOptions): DynamicModule {
        return {
            module: GoogleCloudStorageModule,
            imports: [GoogleCloudStoragePrincipalModule.registerAsync(options)],
        };
    }
}
