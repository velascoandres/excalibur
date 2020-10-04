import {DynamicModule, Global, Module} from '@nestjs/common';
import {DataBaseConfig} from './interfaces/data-base-config.interface';
import {DataBaseCoreModule} from './data-base-core.module';
import {BulkDataConfig} from './interfaces/bulk-data-config.interface';
import {ConfigStore} from './store/config.store';

@Global()
@Module({})
export class DataBaseModule {
    static forRoot(config: DataBaseConfig): DynamicModule {
        return DataBaseCoreModule.forRoot(config);
    }

    static forBulkData(config: BulkDataConfig): DynamicModule {
        ConfigStore.addBulkConfig(config);
        return {
            module: DataBaseModule,
        };
    }
}
