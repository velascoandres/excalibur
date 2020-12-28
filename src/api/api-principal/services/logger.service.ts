import {Logger} from '@nestjs/common';

export class LoggerService {
    private _logger = new Logger();
    private static _instance: LoggerService;


    private constructor() {}

    public static getInstance() {
        if (!LoggerService._instance) {
            LoggerService._instance = new LoggerService();
        }
        return LoggerService._instance;
    }

    get logger() {
        return this._logger;
    }
}
