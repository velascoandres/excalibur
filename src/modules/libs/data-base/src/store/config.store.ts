import {BulkDataConfig, BulkMongooseDataConfig} from '../../../../..';

export class ConfigStore {
    private static readonly bulksConfig: BulkDataConfig[] = [];

    private static readonly bulksMongooseConfig: BulkMongooseDataConfig[] = [];

    static addBulkConfig(
        config: BulkDataConfig,
    ) {
        this.bulksConfig.push(config);
    }

    static addBulkMongooseConfig(
        config: BulkMongooseDataConfig,
    ) {
        this.bulksMongooseConfig.push(config);
    }

    static get bulkDataConfigStore() {
        return this.bulksConfig;
    }

    static get bulkDataMonggoseConfigStore() {
        return this.bulksMongooseConfig;
    }
}
