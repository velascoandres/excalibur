import {SelectQueryBuilder} from 'typeorm';
import {WherePuroInterface} from '../interfaces/wherePuro.interface';

export function generarWhere(
    consulta: SelectQueryBuilder<{}>,
    wherePuro: WherePuroInterface,
    conjuncion: string,
) {
    switch (conjuncion) {
        case 'and':
            return consulta.andWhere(wherePuro.where, wherePuro.parametros);
        case 'or':
            return consulta.orWhere(wherePuro.where, wherePuro.parametros);
        default:
            return consulta.andWhere(wherePuro.where, wherePuro.parametros);
    }
}