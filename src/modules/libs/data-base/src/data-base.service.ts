import {Inject, Injectable} from '@nestjs/common';
import {BulkDataConfig} from './interfaces/bulk-data-config.interface';
import {BULKS_CONFIG, ENV_CONFIG} from './constants/inject-keys';
import {LogInterface} from './interfaces/log.interface';
import {DataBaseHelper} from './utils/data-base-helper';
import {LogHelper} from './utils/log-helper';

@Injectable()
export class DataBaseService {
    private readonly _logs: LogInterface[] = [];

    constructor(
        @Inject(ENV_CONFIG)
        private readonly productionFlag: boolean,
        @Inject(BULKS_CONFIG)
        private readonly bulksConfig: BulkDataConfig[],
    ) {
    }

    async insertData() {
        const bulksConfig = this.bulksConfigOrdered;
        for (const bulk of bulksConfig) {
            const entity = bulk.entity;
            const name = bulk.aliasName ? bulk.aliasName : entity.name;
            const connection = bulk.connection ? bulk.connection : 'default';
            const currentLog: LogInterface = {
                creationOrder: bulk.creationOrder,
                entityName: name,
                connection,
            };
            const filePath = this.productionFlag ? bulk.pathProd : bulk.pathDev
            if (filePath) {
                const DtoClass = bulk.dtoClassValidation;
                let totalCreated: number = 0;
                try {
                    totalCreated = await DataBaseHelper
                        .insertData(
                            filePath,
                            DtoClass,
                            entity,
                            connection,
                        );
                    currentLog.created = totalCreated;
                } catch (error) {
                    currentLog.errors = error.toString();
                }
            }
            this.saveLog(currentLog);
        }
    }

    private get bulksConfigOrdered() {
        return this.bulksConfig.sort(
            (aFBC, befBC) => aFBC.creationOrder - befBC.creationOrder,
        );
    }

    private saveLog(log: LogInterface) {
        this._logs.push(log);
    }

    logs() {
        return this._logs;
    }

    showSummary(bordered: boolean = true): void {
        const {logs, errorsLog} = LogHelper.buildLogTable(this._logs, bordered);
        console.info(logs);
        if (errorsLog.length) {
            console.error('\nErrors: \n' + errorsLog);
        }
    }

}
