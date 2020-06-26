import {SelectQueryBuilder} from 'typeorm';
import {OperadorConsultaSimpleInterface} from '../../../../..';
import {PureWhereInterface} from '../interfaces/pureWhereInterface';
import {generateWhereQuery} from './generate-where-query';
import {buildSimplePureWhere} from './build-simple-pure-where';
import {buildPureWhereWithOperator} from './build-pure-where-with-operator';
import {OperadorConsultaInterface} from '../../../../..';
import {VerificatorHelper} from '../verificators-functions/verificator-helper';

export function generateWhere(
    query: SelectQueryBuilder<{}>,
    atribute: string,
    value: string | OperadorConsultaSimpleInterface | any[], // Atribute value
    entityName: string,
    atributeIndex: number = 1,
): SelectQueryBuilder<{}> {
    // Verify is an Array
    const isArray = value instanceof Array;
    if (isArray) {
        const values = value as any[];
        values.forEach(
            (orValue, index: number) => {
                // If value has an operator Ex: -> "price" :{"operacion":"In", "valores":"[10,20]"}
                // const hasComplexQueryOperator = esInterfazDeOperadorConsultaCompuesta(orValue);
                const hasComplexQueryOperator = VerificatorHelper.isComplexOperatorObject(orValue);
                // Define a pure-where object
                let generatedPureWhere: PureWhereInterface | undefined;
                if (hasComplexQueryOperator) {
                    orValue = orValue as OperadorConsultaInterface;
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
                    query = generateWhereQuery(
                        query,
                        generatedPureWhere,
                        index > 0 ? 'or' : 'and',
                    );
                }

            },
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