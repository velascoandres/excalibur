import {SelectQueryBuilder} from 'typeorm';
import {OperadorConsultaInterface} from '../../../../..';
import {generarWhere} from './generarWhere';
import {armarWherePuroConOperador} from './armarWherePuroConOperador';
import {WherePuroInterface} from '../interfaces/wherePuro.interface';

// Arma el where con operador en base al conexto de la consulta y retorna un SelectQueryBuilder
export function armarWhereConOperador(
    consulta: SelectQueryBuilder<{}>,
    atributo: string,
    valorConOperador: OperadorConsultaInterface,
    entidad: string,
    indice: number = 1,
): SelectQueryBuilder<{}> {
    const conjuncion = 'and';
    // if (valorConOperador.conjuncion) {
    //     conjuncion = valorConOperador.conjuncion;
    // }
    const wherePuro = armarWherePuroConOperador(atributo, valorConOperador, entidad, indice) as WherePuroInterface;
    return generarWhere(consulta, wherePuro, conjuncion);
}