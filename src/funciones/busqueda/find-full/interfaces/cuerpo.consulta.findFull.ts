import {OperadorConsultaInterface} from './operador.consulta.interface';

export interface CuerpoConsultaFindFull {
    [key: string]: string | number | CuerpoConsultaFindFull | OperadorConsultaInterface | [number] | [string] | object;
}