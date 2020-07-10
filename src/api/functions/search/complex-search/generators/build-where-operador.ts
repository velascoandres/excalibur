import {ObjectLiteral, SelectQueryBuilder} from 'typeorm';
import {generateWhereQuery} from './generate-where-query';
import {buildPureWhereWithOperator} from './build-pure-where-with-operator';
import {PureWhereInterface} from '../interfaces/pureWhereInterface';

// Arma el where con operador en base al conexto de la consulta y retorna un SelectQueryBuilder
export function buildWhereOperador(
    currentQuery: SelectQueryBuilder<{}>,
    atribute: string,
    valueWithOperator: ObjectLiteral,
    entityName: string,
    index: number = 1,
): SelectQueryBuilder<{}> {
    let conjuncion = 'and';
    if (valueWithOperator.$or) {
        conjuncion = 'or';
    }
    console.log(conjuncion);
    const pureWhere = buildPureWhereWithOperator(atribute, valueWithOperator, entityName, index) as PureWhereInterface;
    return generateWhereQuery(currentQuery, pureWhere, conjuncion);
}