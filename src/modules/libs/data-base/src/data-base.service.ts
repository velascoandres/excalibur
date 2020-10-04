import {Inject, Injectable} from '@nestjs/common';
import {BulkDataConfig} from './interfaces/bulk-data-config.interface';
import {BULKS_CONFIG, ENV_CONFIG} from './constants';
import {LogInterface} from './interfaces/log.interface';
import {getRepository} from './utils/get-repository';

@Injectable()
export class DataBaseService {
    constructor(
        @Inject(ENV_CONFIG)
        private readonly productionFlag: boolean,
        @Inject(BULKS_CONFIG)
        private readonly bulksConfig: BulkDataConfig[],
        private readonly _logs: LogInterface[] = [],
    ) {
    }

    async insertData() {
        const bulksConfig = this.bulksConfigOrdered;
        for (const bulk of bulksConfig) {
            // 1 Obtain repository
            let repository;
            const name = bulk.aliasName ? bulk.aliasName : bulk.entityName.name;
            const connection = bulk.conection ? bulk.conection : 'default';
            const currentLog: LogInterface = {
                creationOrder: bulk.creationOrder,
                entityName: name,
                connection,
            };
            try {
                repository = getRepository(bulk.entityName, bulk.conection);
            } catch (error) {
                currentLog.errors = error;
            }
            // 2 Get file path
            const filePath = this.productionFlag ? bulk.pathProd : bulk.pathDev;
            const DtoClass = bulk.dtoClassValidation;
            // 3 Create Data
            // 3.1 Lecture
            // 3.2 Validation
            // 3.4 Insertion
            this.saveLog(currentLog);
        }
    }

    private get bulksConfigOrdered() {
        return this.bulksConfig.sort(
            (aFBC, befBC) => aFBC.creationOrder - befBC.creationOrder,
        );
    }

    saveLog(log: LogInterface) {
        this._logs.push(log);
    }

    logs() {
        return this._logs;
    }
}
