import {DataBaseConfig} from './interfaces/data-base-config.interface';
import {TypeOrmModule, TypeOrmModuleOptions} from '@nestjs/typeorm';
import {DynamicModule, Global, Module, Provider} from '@nestjs/common';
import {ConfigStore} from './store/config.store';
import {BULKS_CONFIG, ENV_CONFIG} from './constants';
import {DataBaseService} from './data-base.service';

@Module(
    {
        providers: [
            DataBaseService,
        ],
        exports: [
            DataBaseService,
        ],
    }
)
export class DataBaseCoreModule {
    static forRoot(config: DataBaseConfig): DynamicModule {
        const bulksConfig = ConfigStore.bulkDataConfigStore;
        const productionFlagProvider: Provider = {
            useValue: config.productionFlag,
            provide: ENV_CONFIG,
        };
        const bulksConfigProvider: Provider = {
            useValue: bulksConfig,
            provide: BULKS_CONFIG,
        };
        const connectionOptios: TypeOrmModuleOptions[] = Object.values(config.conections);
        const dependencies = DataBaseCoreModule.buildDependencies(connectionOptios);
        return {
            module: DataBaseCoreModule,
            imports: [
                ...dependencies,
            ],
            providers: [
                productionFlagProvider,
                bulksConfigProvider,
                DataBaseService,
            ],
            exports: [
                ...dependencies,
                productionFlagProvider,
                bulksConfigProvider,
                DataBaseService,
            ]
        };
    }

    private static buildDependencies(connOptions: TypeOrmModuleOptions[]): DynamicModule[] {
        const dependencies = connOptions.map(
            options => TypeOrmModule.forRoot(options),
        );
        return [
            ...dependencies,
        ];
    }
}
