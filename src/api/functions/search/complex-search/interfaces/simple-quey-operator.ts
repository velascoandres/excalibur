export interface SimpleQueyOperator {
    conjunction?: 'and' | 'or';
    values?: string | number | [number]  | [string];
}