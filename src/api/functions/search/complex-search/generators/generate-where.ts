import {SelectQueryBuilder} from 'typeorm';
import {OperadorConsultaSimpleInterface} from '../../../../..';
import {WherePuroInterface} from '../interfaces/wherePuro.interface';
import {generarWhere} from './generarWhere';
import {armarWherePuro} from './armarWherePuroSimple';
import {
    isComplexOperatorObject
} from '../verificators-functions/esInterfazDeOperardorConsulta';
import {armarWherePuroConOperador} from './armarWherePuroConOperador';
import {OperadorConsultaInterface} from '../../../../..';

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
                const hasComplexQueryOperator = isComplexOperatorObject(orValue);
                // Define a pure-where object
                let generatedPureWhere: WherePuroInterface | undefined;
                if (hasComplexQueryOperator) {
                    orValue = orValue as OperadorConsultaInterface;
                    orValue.conjuncion = 'or';
                    generatedPureWhere = armarWherePuroConOperador(
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
                    query = generarWhere(
                        query,
                        generatedPureWhere,
                        index > 0 ? 'or' : 'and',
                    );
                }

            },
        );
        return query;
    }
    const wherePuroArmado: WherePuroInterface | undefined = armarWherePuro(
        atribute,
        value,
        entityName,
        atributeIndex,
    );
    return generarWhere(query, wherePuroArmado as WherePuroInterface, wherePuroArmado?.conjuncion as string);
}