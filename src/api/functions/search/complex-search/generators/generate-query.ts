import {SelectQueryBuilder} from 'typeorm';
import {buildWhereWithjoin} from './build-where-with-join';
import {findJoinRelationType} from '../splitters/find-join-relation-type';

import {generateWhere} from './generate-where';
import {buildWhereOperador} from './build-where-operador';
import {VerificatorHelper} from '../verificators-functions/verificator-helper';
import {BASE_ENTITY_NAME, SELECT_KEYWORD} from '../constants/query-operators';
import {buildSelect} from './build-select';

// Esta es la funcion api-principal en donde primero se itera a la raiz
export async function generateQuery(
    baseQueryBuilder: SelectQueryBuilder<{}>,
    query: { [x: string]: any; },
    parentEntity: string = BASE_ENTITY_NAME,
): Promise<SelectQueryBuilder<{}>> {
    const atributes = Object.keys(query);
    await atributes.forEach(
        (atributeName: string) => {
            const atributeValue = query[atributeName];
            // Si el valor del atributo es un objeto
            const isObject = VerificatorHelper.verifyIsObject(atributeValue);
            // Si el valor del atributo es un objeto del tipo consulta compuesta
            // const tieneOperadorConsultaCompuesta = esInterfazDeOperadorConsultaCompuesta(valorAtributo);
            const hasComplexOperatorQuery = VerificatorHelper.isComplexOperatorObject(atributeValue);
            // Si es un objeto y no tiene consultaCompuesta entonces debe ser una relacion join.
            const isJoinRelation = isObject && !hasComplexOperatorQuery;
            const isSelect = atributeName === SELECT_KEYWORD;
            if (hasComplexOperatorQuery) {
                baseQueryBuilder = buildWhereOperador(baseQueryBuilder, atributeName, atributeValue, parentEntity);
            }
            if (!hasComplexOperatorQuery && !isObject && !isSelect) {
                baseQueryBuilder = generateWhere(baseQueryBuilder, atributeName, atributeValue, parentEntity);
            }
            if (isJoinRelation) {
                const joinType: 'inner' | 'left' = findJoinRelationType(query[atributeName]);
                baseQueryBuilder = buildWhereWithjoin(
                    baseQueryBuilder,
                    atributeName,
                    atributeValue,
                    parentEntity,
                    joinType,
                );
            }
            if (isSelect) {
                baseQueryBuilder = buildSelect(baseQueryBuilder, parentEntity, atributeValue, false);
            }
        },
    );
    return baseQueryBuilder;
}
