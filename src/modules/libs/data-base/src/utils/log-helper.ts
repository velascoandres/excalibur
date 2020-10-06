import {COLORS} from '../constants/colors';
import {GridOptions, RowOptions} from '../interfaces/row-options.interface';
import {LogInterface} from '../../../../..';

export class LogHelper {
    static addSpaces(value: string, spaces: number) {
        const total = spaces - value.length;
        let response = value;
        value.trim();
        for (let i = 0; i < total; i++) {
            response = response + ' ';
        }
        return response;
    }

    static encloseColor(value: string, color: COLORS) {
        return `${color}${value}${COLORS.reset}`;
    }

    static encloseMargin(value: string, patt: string, color: COLORS = COLORS.bgWhite) {
        return `${color}${patt} ${value} ${patt}${COLORS.reset}`;
    }

    static generateBorder(patt: string, lenght: number) {
        let response = patt;
        for (let i = 0; i < lenght; i++) {
            response = response + response;
        }
        return response;
    }


    static generateRowFormat(
        options: RowOptions,
    ) {
        const {length, value, borderColor, bottomTopPatt, valueColor,lateralPath} = options;
        let rowFormat = LogHelper.addSpaces(value, length);
        rowFormat = LogHelper.encloseColor(rowFormat, valueColor);
        rowFormat = LogHelper.encloseMargin(rowFormat, lateralPath, borderColor);
        const border = LogHelper.generateBorder(bottomTopPatt, length);
        return '\n' + border + '\n' + rowFormat + '\n' + border + '\n';
    }

    static generateGrid(
        options: GridOptions,
    ) {
        const {values, length, grid, borderColor, valueColor,bottomTopPatt, lateralPath} = options;
        let cols: string = values.map(
            (value: string, index: number) => {
                const colLength = grid[index];
                return LogHelper.addSpaces(value, colLength);
            }
        ).join();
        cols = LogHelper.encloseColor(cols, valueColor);
        cols = LogHelper.encloseMargin(cols, lateralPath, borderColor);
        const border = LogHelper.generateBorder(bottomTopPatt, length);
        return cols + border + '\n';
    }

    static buildLogTable(logs: LogInterface[]) {
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
        return orderedLogs.map(
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
    }
}
