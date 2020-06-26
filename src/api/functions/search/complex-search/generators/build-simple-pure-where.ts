import {OperadorConsultaSimpleInterface} from '../../../../..';
import {PureWhereInterface} from '../interfaces/pureWhereInterface';
import {ObjectLiteral} from 'typeorm';
import {VerificatorHelper} from '../verificators-functions/verificator-helper';

export function buildSimplePureWhere(
    attribute: string,
    value: string | OperadorConsultaSimpleInterface | Array<any>,
    entityName: string,
    index: number = 1,
): PureWhereInterface | undefined {
    const strParameterKey = `valorAtributo${index}${entityName}${attribute}`;
    const initialParemeters: ObjectLiteral = {};
    if (attribute !== 'pjoin') {
        const tieneOperadorSimple = VerificatorHelper.IsSimpleOperatorQueryInterface(value);
        if (tieneOperadorSimple) {
            value = value as OperadorConsultaSimpleInterface;
            const conjuncion = value.conjunction ? value.conjunction : 'and';
            const valores = value.values instanceof Array ? [...value.values] : [value.values];
            initialParemeters[strParameterKey] = valores.join(',');
            return {
                where: `${entityName}.${attribute}=:${strParameterKey}`,
                parameters: initialParemeters,
                conjunction: conjuncion,
            };
        } else {
            initialParemeters[strParameterKey] = value;
            return {
                where: `${entityName}.${attribute}=:${strParameterKey}`,
                parameters: initialParemeters,
                conjunction: 'and',
            };
        }
    } else {
        return undefined;
    }
}