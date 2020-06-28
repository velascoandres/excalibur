import {SelectQueryBuilder} from 'typeorm';
import {PureWhereInterface} from '../interfaces/pureWhereInterface';

export function generateWhereQuery(
    currentQuery: SelectQueryBuilder<{}>,
    pureWhere: PureWhereInterface,
    conjuntion: string,
) {
    switch (conjuntion) {
        case 'and':
            return currentQuery.andWhere(pureWhere.where, pureWhere.parameters);
        case 'or':
            return currentQuery.orWhere(pureWhere.where, pureWhere.parameters);
        default:
            return currentQuery.andWhere(pureWhere.where, pureWhere.parameters);
    }
}