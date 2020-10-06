import {COLORS} from '../constants/colors';


export interface PrimaryRow {
    length: number;
    valueColor: COLORS;
    borderColor: COLORS;
    bottomTopPatt: string;
    lateralPath: string;
}

export interface RowOptions extends PrimaryRow {
    value: string;
}

export interface GridOptions extends PrimaryRow {
    values: string[];
    grid: number[];
}
