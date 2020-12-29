import {PureWhereInterface} from '../interfaces/pureWhereInterface';
import {buildPureWhereWithOperator, compressKey} from '../generators/build-pure-where-with-operator';
import {ObjectLiteral} from 'typeorm';
import {VerificatorHelper} from '../verificators-functions/verificator-helper';

export function reduceFunctionalWhereOr(
    entityName: string,
    attributeName: string,
): (ac: PureWhereInterface, val: any, index: number) => PureWhereInterface {
    return (accumulator: PureWhereInterface, currentValue, localIndex: number) => {
        let pureWhereLocal: PureWhereInterface;
        const isComplexOperatorQuery = VerificatorHelper.isComplexOperatorObject(currentValue);
        // const strKeyLocalParameter = `attributeValue${localIndex}${entityName}${attributeName}`;
        const strKeyLocalParameter = compressKey(localIndex, entityName, attributeName);
        if (isComplexOperatorQuery) {
            pureWhereLocal = buildPureWhereWithOperator(
                attributeName,
                currentValue,
                entityName,
                localIndex,
            ) as PureWhereInterface;
        } else {
            const localParameters: ObjectLiteral = {};
            localParameters[strKeyLocalParameter] = currentValue;
            pureWhereLocal = {
                where: `${entityName}.${attributeName}=:${strKeyLocalParameter}`,
                parameters: localParameters,
            };
        }
        accumulator.where = accumulator.where + ' ' + (localIndex > 0 ? 'or' : '') + ' ' + pureWhereLocal.where;
        if (localIndex > 0) {
            accumulator.parameters = {...accumulator.parameters, ...pureWhereLocal.parameters};
        } else {
            accumulator.parameters = {...pureWhereLocal.parameters};
        }
        accumulator.conjunction = 'and';
        return accumulator;
    };
}
