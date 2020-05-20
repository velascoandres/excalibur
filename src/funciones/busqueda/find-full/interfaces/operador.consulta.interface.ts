import {OperadorConsultaSimpleInterface} from './operador.consulta.simple.interface';

export interface OperadorConsultaInterface extends OperadorConsultaSimpleInterface{
    operacion: 'In' | 'NotIn' | 'Between' | 'Like' | 'Not' | 'NotEqual' | 'LessThan' | 'MoreThan' | 'ILike' | 'LessThanEq' | 'MoreThanEq';
    // valores: [string | number] | number | string;
}
