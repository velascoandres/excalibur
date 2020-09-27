import {SimpleQueyOperator} from '../../../../..';
import {PureWhereInterface} from '../interfaces/pureWhereInterface';
import {ObjectLiteral} from 'typeorm';
import {VerificatorHelper} from '../verificators-functions/verificator-helper';

export function buildSimplePureWhere(
    attribute: string,
    value: string | SimpleQueyOperator | Array<any>,
    entityName: string,
    index: number = 1,
): PureWhereInterface | undefined {
    const strParameterKey = `valorAtributo${index}${entityName}${attribute}`;
    const initialParemeters: ObjectLiteral = {};
    if (!VerificatorHelper.isAttKeyWord(attribute)) {
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
