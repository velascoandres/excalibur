import {PureWhereInterface} from '../interfaces/pureWhereInterface';
import {buildPureWhereWithOperator} from '../generators/build-pure-where-with-operator';
import {ObjectLiteral} from 'typeorm';
import {VerificatorHelper} from '../verificators-functions/verificator-helper';

export function reduceFunctionalWhereOr(
    entityName: string,
    attributeName: string,
): (ac: PureWhereInterface, val: any, index: number) => PureWhereInterface {
    return (acumulator: PureWhereInterface, currentValue, localIndex: number) => {
        let pureWhereLocal: PureWhereInterface;
        // const esOperadorConsulta = esInterfazDeOperadorConsultaCompuesta(valorArreglo);
        const isComplexOperatorQuery = VerificatorHelper.isComplexOperatorObject(currentValue);
        const strKeyLocalParameter = `attributeValue${localIndex}${entityName}${attributeName}`;
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
        acumulator.where = acumulator.where + ' ' + (localIndex > 0 ? 'or' : '') + ' ' + pureWhereLocal.where;
        if (localIndex > 0) {
            acumulator.parameters = {...acumulator.parameters, ...pureWhereLocal.parameters};
        } else {
            acumulator.parameters = {...pureWhereLocal.parameters};
        }
        acumulator.conjunction = 'and';
        console.log(acumulator);
        return acumulator;
    };
}