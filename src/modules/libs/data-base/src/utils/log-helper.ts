import {COLORS} from '../constants/colors';
import {GridOptions, RowOptions} from '../interfaces/row-options.interface';
import {BulkErrors, LogInterface} from '../../../../..';
import {GRIDS, ROW_LENGTH} from '../constants/grid';
import {ValidationResponse} from '../interfaces/validation.response';

export class LogHelper {

    static rowLength: number = ROW_LENGTH;
    static grids: number[] = GRIDS;

    static addSpaces(value: string, spaces: number) {
        const total = spaces - value.length;
        let response = value;
        for (let i = 0; i < total; i++) {
            response = response + ' ';
        }
        return response;
    }

    static encloseColor(value: string, color: COLORS) {
        return `${color}${value}${COLORS.reset}`;
    }

    static encloseMargin(value: string, patt: string, color: COLORS = COLORS.bgWhite) {
        return `${color}${patt}${COLORS.reset} ${value} ${color}${patt}${COLORS.reset}`;
    }

    static generateBorder(patt: string, lenght: number, color: COLORS = COLORS.fgWhite, type?: 'mid' | 'top' | 'bot'): string {
        const mid = ['╠', '╣'];
        const top = ['╔', '╗'];
        const bot = ['╚', '╝'];
        let corner = ['═', '═'];
        switch (type) {
            case 'bot':
                corner = bot;
                break;
            case 'top':
                corner = top;
                break;
            case 'mid':
                corner = mid;
                break;
        }
        let response: string = patt;
        for (let i = 0; i < lenght - 2; i++) {
            response = response + patt;
        }
        response = corner[0] + response + corner[1];
        return LogHelper.encloseColor(response, color);
    }


    static generateRowFormat(
        options: RowOptions,
    ) {
        const {length, value, borderColor, bottomTopPatt, valueColor, lateralPath} = options;
        let rowFormat = LogHelper.addSpaces(value, length);
        rowFormat = LogHelper.encloseColor(rowFormat, valueColor);
        rowFormat = LogHelper.encloseMargin(rowFormat, lateralPath, borderColor);
        const topBorder = LogHelper.generateBorder(bottomTopPatt, length + 3, borderColor, 'top');
        const midBorder = LogHelper.generateBorder(bottomTopPatt, length + 3, borderColor, 'mid');
        return '\n' + topBorder + '\n' + rowFormat + '\n' + midBorder + '\n';
    }

    static formatErrors(
        error: Partial<BulkErrors>,
    ) {
        const keys = Object.keys(error);
        const border = LogHelper.generateBorder('═', LogHelper.rowLength + 3);
        const errors = keys.reduce(
            (acc: string, key: string) => {
                if (key === 'validationError') {
                    const value = error[key as keyof BulkErrors];
                    if (value instanceof Array) {
                        const validationErrors: ValidationResponse<any>[] = error[key];
                        const parsedError = validationErrors.map(
                            (err) => {
                                return LogHelper.formatError(
                                    {
                                        type: key,
                                        data: JSON.stringify(err.parsedData),
                                        errors: err.errors,
                                    },
                                );
                            },
                        ).join('');
                        acc = acc + parsedError;
                    }
                } else {
                    const value = error[key as keyof BulkErrors];
                    acc = acc + value;
                }
                return acc;
            }, ''
        );
        return COLORS.fgYellow + errors + COLORS.reset + '\n' + border + '\n';
    }

    static formatError(
        errorDetail: {
            type: string;
            data: any;
            errors: any;
        }
    ): string {
        const {type, data, errors} = errorDetail;
        const title = LogHelper.encloseColor(type, COLORS.fgRed);
        const dataColored = LogHelper.encloseColor(data, COLORS.fgYellow);
        const error = LogHelper.encloseColor(errors, COLORS.fgYellow);
        return [title, dataColored, error].join('\n');
    }

    static generateGrid(
        options: GridOptions,
    ) {
        const {values, length, grid, borderColor, valueColor, bottomTopPatt, lateralPath, isLast} = options;
        let cols: string = values.map(
            (value: string, index: number) => {
                const colLength = grid[index];
                return LogHelper.addSpaces(value, colLength);
            }
        ).join('');
        cols = LogHelper.encloseColor(cols, valueColor);
        cols = LogHelper.encloseMargin(cols, lateralPath, borderColor);
        const border = LogHelper.generateBorder(bottomTopPatt, length + 3, COLORS.fgWhite, isLast ? 'bot' : 'mid');
        return cols + '\n' + border + '\n';
    }


    static setGrids(logs: LogInterface[]) {
        const orderedLogs = logs.sort(
            (a: LogInterface, b: LogInterface) => {
                const after = a.entityName.length;
                const before = b.entityName.length;
                return before - after;
            },
        );
        const log = orderedLogs[0];
        const entityLength = log.entityName.length;
        LogHelper.grids[1] = entityLength + 5;
        LogHelper.rowLength = LogHelper.grids.reduce((a, b) => a + b, 0);
    }

    static buildLogTable(logs: LogInterface[], showMargin: boolean = true) {
        const marginTopBottom = showMargin ? '═' : '';
        const marginLateral = showMargin ? '║' : '';
        LogHelper.setGrids(logs);
        const orderedLogs = logs.sort(
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
        return orderedLogs.reduce(
            (
                acc: { errorsLog: string; logs: string },
                log: LogInterface,
                index: number,
                arr: LogInterface[],
            ) => {
                const isLast = index === (arr.length - 1);
                let currentError: string = '';
                let showConecction = true;
                let isLastForConnection = false;
                if (index) {
                    const previousValue: LogInterface = arr[index - 1];
                    if (previousValue.connection === log.connection) {
                        showConecction = false;
                    }
                }
                if (index < arr.length - 1) {
                    const nextValue: LogInterface = arr[index + 1];
                    if (nextValue.connection !== log.connection) {
                        isLastForConnection = true;
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
                        grid: LogHelper.grids,
                        length: LogHelper.rowLength,
                        lateralPath: marginLateral,
                        borderColor: COLORS.fgWhite,
                        bottomTopPatt: marginTopBottom,
                        valueColor: errors ? COLORS.fgRed : COLORS.fgGreen,
                        isLast: isLast || isLastForConnection,
                    }
                );
                if (showConecction) {
                    const connectionHeader = LogHelper.generateRowFormat(
                        {
                            value: log.connection,
                            length: LogHelper.rowLength,
                            lateralPath: marginLateral,
                            borderColor: COLORS.fgWhite,
                            bottomTopPatt: marginTopBottom,
                            valueColor: COLORS.fgYellow,
                        },
                    );
                    const headers = LogHelper.generateGrid(
                        {
                            values: ['Order', 'Entity', 'Created', 'Status'],
                            grid: LogHelper.grids,
                            length: LogHelper.rowLength,
                            lateralPath: marginLateral,
                            borderColor: COLORS.fgWhite,
                            bottomTopPatt: marginTopBottom,
                            valueColor: COLORS.fgBlue,
                        }
                    );
                    if (errors) {
                        const errorHeader = LogHelper.generateRowFormat(
                            {
                                value: log.connection,
                                length: LogHelper.rowLength,
                                lateralPath: marginLateral,
                                borderColor: COLORS.fgRed,
                                bottomTopPatt: marginTopBottom,
                                valueColor: COLORS.fgYellow,
                            },
                        );
                        currentError += errorHeader + currentError;
                    }
                    acc.logs += connectionHeader + headers + row;
                } else {
                    acc.logs += row;
                }
                if (errors) {
                    const formatError = LogHelper.formatErrors(errors);
                    const entityError = LogHelper.generateRowFormat(
                        {
                            value: entityName,
                            length: LogHelper.rowLength,
                            lateralPath: '  ',
                            borderColor: COLORS.fgRed,
                            bottomTopPatt: marginTopBottom,
                            valueColor: COLORS.fgYellow,
                        },
                    );
                    currentError += entityError + formatError;
                }
                acc.errorsLog += currentError;
                return acc;
            }, {errorsLog: '', logs: ''}
        );
    }
}
