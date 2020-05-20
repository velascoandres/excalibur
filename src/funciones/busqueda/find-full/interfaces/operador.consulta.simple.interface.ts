export interface OperadorConsultaSimpleInterface {
    conjuncion?: 'and' | 'or';
    valores?: string | number | [number]  | [string];
}