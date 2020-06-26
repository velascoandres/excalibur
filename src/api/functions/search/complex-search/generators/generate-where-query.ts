import {SelectQueryBuilder} from 'typeorm';
import {WherePuroInterface} from '../interfaces/wherePuro.interface';

export function generateWhereQuery(
    currentQuery: SelectQueryBuilder<{}>,
    pureWhere: WherePuroInterface,
    conjuntion: string,
) {
    switch (conjuntion) {
        case 'and':
            return currentQuery.andWhere(pureWhere.where, pureWhere.parametros);
        case 'or':
            return currentQuery.orWhere(pureWhere.where, pureWhere.parametros);
        default:
            return currentQuery.andWhere(pureWhere.where, pureWhere.parametros);
    }
}