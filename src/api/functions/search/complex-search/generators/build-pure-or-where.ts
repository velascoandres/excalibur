import {reduceFunctionalWhereOr} from '../reductors/reduce-functional-where-or';
import {PureWhereInterface} from '../interfaces/pureWhereInterface';

export function buildPureOrWhere(
    attribute: string,
    value: string | Array<any>,
    entityName: string,
    index: number = 1,
): PureWhereInterface {
    const values = value as Array<any>;
    return values.reduce(
        reduceFunctionalWhereOr(entityName, attribute),
        {parameters: {}, where: ''},
    );
}