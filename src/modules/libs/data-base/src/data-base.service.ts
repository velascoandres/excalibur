import {Inject, Injectable} from '@nestjs/common';
import {BulkDataConfig} from './interfaces/bulk-data-config.interface';
import {BULKS_CONFIG, ENV_CONFIG} from './constants';

@Injectable()
export class DataBaseService {
    constructor(
        @Inject(ENV_CONFIG)
            productionFlag: boolean,
        @Inject(BULKS_CONFIG)
            bulksConfig: BulkDataConfig[],
    ) {
    }
}
