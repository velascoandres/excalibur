import {SimpleQueyOperator} from '../../../../..';
import {PureWhereInterface} from '../interfaces/pureWhereInterface';
import {ObjectLiteral} from 'typeorm';
import {VerificatorHelper} from '../verificators-functions/verificator-helper';
import {JOIN_KEYWORD} from '../constants/query-operators';

export function buildSimplePureWhere(
    attribute: string,
    value: string | SimpleQueyOperator | Array<any>,
    entityName: string,
    index: number = 1,
): PureWhereInterface | undefined {
    const strParameterKey = `valorAtributo${index}${entityName}${attribute}`;
    const initialParemeters: ObjectLiteral = {};
    if (attribute !== JOIN_KEYWORD) {
        // const tieneOperadorSimple = VerificatorHelper.IsSimpleOr(value);
        // if (tieneOperadorSimple) {
        //     value = value as SimpleQueyOperator;
        //     const conjuncion = value.conjunction ? value.conjunction : 'and';
        //     const valores = value.values instanceof Array ? [...value.values] : [value.values];
        //     initialParemeters[strParameterKey] = valores.join(',');
        //     return {
        //         where: `${entityName}.${attribute}=:${strParameterKey}`,
        //         parameters: initialParemeters,
        //         conjunction: conjuncion,
        //     };
        // } else {
        //     initialParemeters[strParameterKey] = value;
        //     return {
        //         where: `${entityName}.${attribute}=:${strParameterKey}`,
        //         parameters: initialParemeters,
        //         conjunction: 'and',
        //     };
        // }
        initialParemeters[strParameterKey] = value;
        return {
            where: `${entityName}.${attribute}=:${strParameterKey}`,
            parameters: initialParemeters,
            conjunction: 'and',
        };
    } else {
        return undefined;
    }
}