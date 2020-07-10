import {ObjectLiteral, SelectQueryBuilder} from 'typeorm';
import {SimpleQueyOperator} from '../../../../..';
import {PureWhereInterface} from '../interfaces/pureWhereInterface';
import {generateWhereQuery} from './generate-where-query';
import {buildSimplePureWhere} from './build-simple-pure-where';
import {buildPureWhereWithOperator} from './build-pure-where-with-operator';
import {VerificatorHelper} from '../verificators-functions/verificator-helper';
import {WherePuroInterface} from '../../../../../../lib/api/functions/search/complex-search/interfaces/wherePuro.interface';

export function generateWhere(
    query: SelectQueryBuilder<{}>,
    atribute: string,
    value: string | SimpleQueyOperator | any[], // Atribute value
    entityName: string,
    atributeIndex: number = 1,
): SelectQueryBuilder<{}> {
    // Verify is an Array
    const isArray = value instanceof Array;
    if (isArray) {
        const values = value as any[];
        const total = values.length;
        const acc = values.reduce(
            (accumulator: PureWhereInterface, orValue, index: number) => {
                // If value has an operator Ex: -> "price" :{"$in":"[10,20]"}
                // const hasComplexQueryOperator = esInterfazDeOperadorConsultaCompuesta(orValue);
                const hasComplexQueryOperator = VerificatorHelper.isComplexOperatorObject(orValue);
                // Define a pure-where object
                let generatedPureWhere: PureWhereInterface | undefined;
                if (hasComplexQueryOperator) {
                    orValue = orValue as ObjectLiteral;
                    orValue.conjunction = 'or';
                    generatedPureWhere = buildPureWhereWithOperator(
                        atribute,
                        orValue,
                        entityName,
                        index,
                    );
                } else {
                    generatedPureWhere = buildSimplePureWhere(
                        atribute,
                        orValue,
                        entityName,
                        index,
                    );
                }
                if (generatedPureWhere) {
                    accumulator.where = `${index > 0 ? accumulator.where : ' '}` + generatedPureWhere.where + `${(index + 1) === total ? ' ' : ' OR '}`;
                    accumulator.parameters = {
                        ...accumulator.parameters,
                        ...generatedPureWhere.parameters,
                    };
                }
                return accumulator;
            }, {
                where: '',
                parametros: {},
            }
        );
        // console.log(acc);
        acc.where = '( ' + acc.where + ' )';
        query = generateWhereQuery(
            query,
            acc,
            'and',
        );
        return query;
    }
    const pureWhereGenerated: PureWhereInterface | undefined = buildSimplePureWhere(
        atribute,
        value,
        entityName,
        atributeIndex,
    );
    return generateWhereQuery(query, pureWhereGenerated as PureWhereInterface, pureWhereGenerated?.conjunction as string);
}