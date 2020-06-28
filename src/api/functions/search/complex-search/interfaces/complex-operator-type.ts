import {SimpleQueyOperator} from './simple-quey-operator';

// ComplexOperatorsType
/// Deprecated
type OperadoresCompuestos = 'In' | 'NotIn' | 'Between' | 'Like' | 'Not' | 'NotEqual' |
    'LessThan' | 'MoreThan' | 'ILike' | 'LessThanEq' | 'MoreThanEq';

// QueryOperator
// export interface OperadorConsultaInterface extends OperadorConsultaSimpleInterface {
//     operacion: ComplexOperator;
// }

export type ComplexOperator = '$in' | '$nin' | '$btw' | '$nbtw'| '$like' | '$ne' |
    '$lt' | '$gt' | '$ilike' | '$lte' | '$gte';
// {"$in":[]}