import {COLORS} from '../constants/colors';
import {GridOptions, RowOptions} from '../interfaces/row-options.interface';

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
        const {value, borderColor, bottomTopPatt, lateralPath} = options;
        let rowFormat = LogHelper.addSpaces(value, length);
        rowFormat = LogHelper.encloseColor(rowFormat, borderColor);
        rowFormat = LogHelper.encloseMargin(rowFormat, bottomTopPatt, borderColor);
        const border = LogHelper.generateBorder(lateralPath, length);
        return border + '\n' + rowFormat + '\n';
    }

    static generateGrid(
        options: GridOptions,
    ) {
        const {values, grid, borderColor, bottomTopPatt, lateralPath} = options;
        let cols: string = values.map(
            (value: string, index: number) => {
                const colLength = grid[index];
                return LogHelper.addSpaces(value, colLength);
            }
        ).join();
        cols = LogHelper.encloseColor(cols, borderColor);
        cols = LogHelper.encloseMargin(cols, bottomTopPatt, borderColor);
        const border = LogHelper.generateBorder(lateralPath, length);
        return cols + border + '\n';
    }
}
