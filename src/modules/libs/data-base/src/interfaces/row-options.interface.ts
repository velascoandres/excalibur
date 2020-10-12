import {COLORS} from '../constants/colors';


export interface PrimaryRow {
    length: number;
    valueColor: COLORS;
    borderColor: COLORS;
    bottomTopPatt: string;
    lateralPath: string;
    isLast?: boolean;
}

export interface RowOptions extends PrimaryRow {
    value: string;
}

export interface GridOptions extends PrimaryRow {
    values: string[];
    grid: number[];
}
