import {SelectQueryBuilder} from 'typeorm';
import {buildWhereWithjoin} from './build-where-with-join';
import {findJoinRelationType} from '../splitters/findJoinRelationType';

import {generateWhere} from './generate-where';
import {buildWhereOperador} from './build-where-operador';
import {VerificatorHelper} from '../verificators-functions/verificator-helper';

// Esta es la funcion api-principal en donde primero se itera a la raiz
export async function generateQuery(
    baseQueryBuilder: SelectQueryBuilder<{}>,
    query: { [x: string]: any; },
    parentEntity: string = 'entidadBase',
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
            if (hasComplexOperatorQuery) {
                baseQueryBuilder = buildWhereOperador(baseQueryBuilder, atributeName, atributeValue, parentEntity);
            }
            if (!hasComplexOperatorQuery && !isObject) {
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
        },
    );
    return baseQueryBuilder;
}