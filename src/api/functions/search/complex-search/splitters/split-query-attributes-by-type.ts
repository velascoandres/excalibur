import {ObjectLiteral} from 'typeorm';
import {VerificatorHelper} from '../verificators-functions/verificator-helper';
import {AttributesSplitedQuery} from '../interfaces/attributes-splited-query';
import {SELECT_KEYWORD} from '../constants/query-operators';


// splitQueryAttributesByType
export function splitQueryAttributesByType(
    query: ObjectLiteral,
): AttributesSplitedQuery {
    // EXAMPLE: INPUT QUERY
    // {
    //     category: {  -> complexQueries -> join with category table
    //         $pjoin: 'inner'
    //     },
    //     price: [  -> whereOr -> array of conditions
    //         {
    //             $in: [5, 10],
    //         },
    //         {
    //             $btw: [20, 30],
    //         }
    //     ],
    //     name: { -> complexOperator -> like-operator
    //         $like: '%choco%'
    //     },
    //     avalaible: 0, -> simpleOperator
    // }
    const attributesList = Object.keys(query);
    return attributesList.reduce(
        (accumulator: AttributesSplitedQuery, attributeName: any) => {
            const attributeValue = query[attributeName];
            const isObject = VerificatorHelper.verifyIsObject(attributeValue);
            const isArray = attributeValue instanceof Array;
            const isSelect = attributeName === SELECT_KEYWORD;
            // const esObjetoConsulta = esInterfazDeOperadorConsultaCompuesta(valor);
            const hasComplexOperatorQuery = VerificatorHelper.isComplexOperatorObject(attributeValue);
            if (isObject && !hasComplexOperatorQuery) {
                accumulator.complexQueries.push(attributeName);
                return accumulator;
            }
            if (!isObject && !hasComplexOperatorQuery && !isArray && !isSelect) {
                accumulator.simpleQueries.push(attributeName);
                return accumulator;
            }
            if (hasComplexOperatorQuery) {
                accumulator.complexOperatorsQueries.push(attributeName);
                return accumulator;
            }
            if (isArray && !isSelect) {
                accumulator.whereOrQueries.push(attributeName);
                return accumulator;
            }
            if (isSelect) {
                accumulator.selectAttrs = [...query[attributeName]];
                return accumulator;
            }
            return accumulator;
        }, {simpleQueries: [], complexOperatorsQueries: [], complexQueries: [], whereOrQueries: [], selectAttrs: []},
    );
}
