import {BulkDataConfig} from '../../../../..';

export class ConfigStore {
    private static readonly bulksConfig: BulkDataConfig[] = [];
    static addBulkConfig(
        config: BulkDataConfig,
    ) {
        this.bulksConfig.push(config);
    }
    static get bulkDataConfigStore() {
        return this.bulksConfig;
    }
}
