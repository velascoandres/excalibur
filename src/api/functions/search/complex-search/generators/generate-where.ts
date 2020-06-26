import {SelectQueryBuilder} from 'typeorm';
import {OperadorConsultaSimpleInterface} from '../../../../..';
import {WherePuroInterface} from '../interfaces/wherePuro.interface';
import {generateWhereQuery} from './generate-where-query';
import {armarWherePuro} from './armarWherePuroSimple';
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
                let generatedPureWhere: WherePuroInterface | undefined;
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
                    generatedPureWhere = armarWherePuro(
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
    const pureWhereGenerated: WherePuroInterface | undefined = armarWherePuro(
        atribute,
        value,
        entityName,
        atributeIndex,
    );
    return generateWhereQuery(query, pureWhereGenerated as WherePuroInterface, pureWhereGenerated?.conjuncion as string);
}