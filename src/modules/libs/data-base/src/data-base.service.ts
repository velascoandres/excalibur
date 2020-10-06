import {Inject, Injectable} from '@nestjs/common';
import {BulkDataConfig} from './interfaces/bulk-data-config.interface';
import {BULKS_CONFIG, ENV_CONFIG} from './constants/inject-keys';
import {LogInterface} from './interfaces/log.interface';
import {DataBaseHelper} from './utils/data-base-helper';
import {LogHelper} from './utils/log-helper';
import {COLORS} from './constants/colors';

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
            const filePath = this.productionFlag ? bulk.pathProd : bulk.pathDev;
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

    private formatLogs(): string {
        const orderedLogs = this._logs.sort(
            (a: LogInterface, b: LogInterface) => {
                const after = a.connection;
                const before = b.connection;
                if (after > before) {
                    return 1;
                }
                if (before > after) {
                    return -1;
                }
                return 0;
            },
        );
        const formatedLogs = orderedLogs.map(
            (log: LogInterface, index: number, arr: LogInterface[]) => {
                let showConecction = true;
                if (index) {
                    const previousValue: LogInterface = arr[index - 1];
                    if (previousValue.connection === log.connection) {
                        showConecction = false;
                    }
                }
                const {creationOrder, created, entityName, errors} = log;
                const row = LogHelper.generateGrid(
                    {
                        values: [
                            creationOrder.toString(),
                            entityName,
                            created ? created.toString() : '0',
                            errors ? 'FAIL' : 'OK',
                        ],
                        grid: [5, 40, 5, 10],
                        length: 60,
                        lateralPath: '||',
                        borderColor: COLORS.fgWhite,
                        bottomTopPatt: '=',
                        valueColor: COLORS.fgYellow,
                    }
                );
                if (showConecction) {
                    const connectionHeader = LogHelper.generateRowFormat(
                        {
                            value: log.connection,
                            length: 60,
                            lateralPath: '||',
                            borderColor: COLORS.fgWhite,
                            bottomTopPatt: '=',
                            valueColor: COLORS.fgYellow,
                        },
                    );
                    const headers = LogHelper.generateGrid(
                        {
                            values: ['Order', 'Entity', 'Created', 'Status'],
                            grid: [5, 40, 5, 10],
                            length: 60,
                            lateralPath: '||',
                            borderColor: COLORS.fgWhite,
                            bottomTopPatt: '=',
                            valueColor: COLORS.fgYellow,
                        }
                    );
                    return connectionHeader + headers + row;
                } else {
                    return row;
                }
            }
        );
        // connection 60
        // Order Entity-Alias Status
        // Errors
        return this._logs.toString();
    }

}
