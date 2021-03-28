import {BulkDataConfig} from '../../../../..';

export class ConfigStore {
    private static readonly bulksConfig: BulkDataConfig[] = [];
    private static noSqlRefsInternal: Record<string, Record<string, string>> = {};

    static addBulkConfig(
        config: BulkDataConfig,
    ) {
        this.bulksConfig.push(config);
    }

    static get bulkDataConfigStore() {
        return this.bulksConfig;
    }

    static get noSqlRefs() {
        return this.noSqlRefsInternal;
    }

    static addRefs(entityName: string, metaID: string, realIndex: string): void {
        this.noSqlRefsInternal[entityName] = {
            ...this.noSqlRefsInternal[entityName],
            [metaID]: realIndex,
        };
    }
}
