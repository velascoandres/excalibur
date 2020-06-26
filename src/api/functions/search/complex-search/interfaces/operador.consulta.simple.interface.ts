export interface OperadorConsultaSimpleInterface {
    conjunction?: 'and' | 'or';
    values?: string | number | [number]  | [string];
}