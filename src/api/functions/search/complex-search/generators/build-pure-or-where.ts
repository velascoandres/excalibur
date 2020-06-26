import {reduceFuntionalWhere} from '../reductors/reduce-funtional-where';
import {OperadorConsultaSimpleInterface} from '../../../../..';
import {PureWhereInterface} from '../interfaces/pureWhereInterface';

export function buildPureOrWhere(
    attribute: string,
    value: string | OperadorConsultaSimpleInterface | Array<any>,
    entityName: string,
    index: number = 1,
): PureWhereInterface {
    const values = value as Array<any>;
    return values.reduce(
        reduceFuntionalWhere(entityName, attribute),
        {parameters: {}, where: ''},
    );
}