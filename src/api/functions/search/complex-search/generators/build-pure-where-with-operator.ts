import {ComplexOperator} from '../interfaces/complex-operator-type';
import {PureWhereInterface} from '../interfaces/pureWhereInterface';
import {ObjectLiteral} from 'typeorm';
import {inReductor} from '../reductors/in-reductor';

export function buildPureWhereWithOperator(
    attribute: string,
    valueWithOperator: ObjectLiteral,
    entityName: string,
    index: number = 1,
): PureWhereInterface | undefined {
    const operator: ComplexOperator = Object.keys(valueWithOperator)[0] as ComplexOperator;
    // const strParameterKey = `attributeValue${index}${entityName}${attribute}`;
    const strParameterKey = compressKey(index, entityName, attribute);
    const initialParameters: Record<string, PureWhereInterface> = {};
    // let conjuncion = 'and';
    // if (valorConOperador.conjuncion) {
    //     conjuncion = valorConOperador.conjuncion;
    // }
    const value = valueWithOperator[operator];
    const valueIsArray = valueWithOperator[operator] instanceof Array;
    let valuesToCompare: any = value;
    if (!valueIsArray) {
        valuesToCompare = [value];
    }
    const pureWhere: PureWhereInterface = {where: '', parameters: {}};
    switch (operator) {
        case '$in':
            pureWhere.where = `${entityName}.${attribute} In(${inReductor(valuesToCompare)})`;
            return pureWhere;
        case '$nin':
            pureWhere.where = `${entityName}.${attribute} Not In(${inReductor(valuesToCompare)})`;
            return pureWhere;

        case '$btw':
            if (valuesToCompare.length === 2) {
                pureWhere.where = `${entityName}.${attribute} Between ${valuesToCompare[0]} and ${valuesToCompare[1]}`;
                return pureWhere;
            }
            return undefined;

        case '$nbtw':
            if (valuesToCompare.length === 2) {
                pureWhere.where = `${entityName}.${attribute} Not Between ${valuesToCompare[0]} and ${valuesToCompare[1]}`;
                return pureWhere;
            }
            return undefined;

        case '$like':
            initialParameters[strParameterKey] = valuesToCompare[0];
            // El valor a comparar ya debe venir con las respectivas wildcards
            // wildcards: %, _, [], ^, -
            pureWhere.where = `${entityName}.${attribute} like :${strParameterKey}`;
            pureWhere.parameters = initialParameters;
            return pureWhere;

        case '$ilike':
            initialParameters[strParameterKey] = valuesToCompare[0];
            // El valor a comparar ya debe venir con las respectivas wildcards
            // wildcards: %, _, [], ^, -
            pureWhere.where = `${entityName}.${attribute} ilike :${strParameterKey}`;
            pureWhere.parameters = initialParameters;
            return pureWhere;

        case '$ne':
            initialParameters[strParameterKey] = valuesToCompare[0];
            pureWhere.where = `${entityName}.${attribute} != :${strParameterKey}`;
            pureWhere.parameters = initialParameters;
            return pureWhere;

        case '$lt':
            initialParameters[strParameterKey] = valuesToCompare[0];
            pureWhere.where = `${entityName}.${attribute} < :${strParameterKey}`;
            pureWhere.parameters = initialParameters;
            return pureWhere;

        case '$gt':
            initialParameters[strParameterKey] = valuesToCompare[0];
            pureWhere.where = `${entityName}.${attribute} > :${strParameterKey}`;
            pureWhere.parameters = initialParameters;
            return pureWhere;

        case '$lte':
            initialParameters[strParameterKey] = valuesToCompare[0];
            pureWhere.where = `${entityName}.${attribute} <= :${strParameterKey}`;
            pureWhere.parameters = initialParameters;
            return pureWhere;

        case '$gte':
            initialParameters[strParameterKey] = valuesToCompare[0];
            pureWhere.where = `${entityName}.${attribute} >= :${strParameterKey}`;
            pureWhere.parameters = initialParameters;
            return pureWhere;

        case '$eq':
            initialParameters[strParameterKey] = valuesToCompare[0];
            pureWhere.where = `${entityName}.${attribute} = :${strParameterKey}`;
            pureWhere.parameters = initialParameters;
            return pureWhere;

        default:
            return undefined;
    }
}

export function compressKey(index: number, entityName: string, attribute: string): string {
    return `${index}${entityName.substring(0, 2)}${attribute}`;
}