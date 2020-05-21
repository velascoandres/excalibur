import {OperadorConsultaSimpleInterface} from './operador.consulta.simple.interface';

type OperadoresCompuestos = 'In' | 'NotIn' | 'Between' | 'Like' | 'Not' | 'NotEqual' |
    'LessThan' | 'MoreThan' | 'ILike' | 'LessThanEq' | 'MoreThanEq';

export interface OperadorConsultaInterface extends OperadorConsultaSimpleInterface {
    operacion: OperadoresCompuestos;
}