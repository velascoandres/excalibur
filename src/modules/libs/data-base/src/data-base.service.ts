import {Inject, Injectable} from '@nestjs/common';
import {BulkDataConfig} from './interfaces/bulk-data-config.interface';
import {BULKS_CONFIG, ENV_CONFIG} from './constants';
import {LogInterface} from './interfaces/log.interface';

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
