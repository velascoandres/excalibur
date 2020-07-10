import {SimpleQueyOperator} from './simple-quey-operator';
import {OperadorConsultaSimpleInterface} from '../../../../../../lib/api/functions/search/complex-search/interfaces/operador.consulta.simple.interface';

// ComplexOperatorsType
/// Deprecated
type OperadoresCompuestos = 'In' | 'NotIn' | 'Between' | 'Like' | 'Not' | 'NotEqual' |
    'LessThan' | 'MoreThan' | 'ILike' | 'LessThanEq' | 'MoreThanEq';

// QueryOperator
// QueryOperator
// export type OperadorConsultaInterface = OperadorConsultaSimpleInterface & {
//     [k in ComplexOperator]: any;
// };

export type ComplexOperator = '$in' | '$nin' | '$btw' | '$nbtw' | '$like' | '$ne' |
    '$lt' | '$gt' | '$ilike' | '$lte' | '$gte' | '$eq';
// {"$in":[]}