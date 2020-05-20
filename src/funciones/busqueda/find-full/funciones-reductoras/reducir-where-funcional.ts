import {WherePuroInterface} from '../interfaces/wherePuro.interface';
import {esInterfazDeOperadorConsultaCompuesta} from '../funciones-verficadoras/esInterfazDeOperardorConsulta';
import {armarWherePuroConOperador} from '../funciones-generadoras/armarWherePuroConOperador';
import {ObjectLiteral} from 'typeorm';

export function reducirWhereFuncional(entidad: string, atributo: string): (ac: WherePuroInterface, val: any, index: number) => WherePuroInterface {
    return (acumulador: WherePuroInterface, valorArreglo, indiceLocal: number) => {
        let wherePuroLocal: WherePuroInterface;
        const esOperadorConsulta = esInterfazDeOperadorConsultaCompuesta(valorArreglo);
        const strLlaveParametroLocal = `valorAtributo${indiceLocal}${entidad}${atributo}`;
        if (esOperadorConsulta) {
            wherePuroLocal = armarWherePuroConOperador(
                atributo,
                valorArreglo,
                entidad,
                indiceLocal,
            ) as WherePuroInterface;
        } else {
            const parametrosLocales: ObjectLiteral = {};
            parametrosLocales[strLlaveParametroLocal] = valorArreglo;
            wherePuroLocal = {
                where: `${entidad}.${atributo}=:${strLlaveParametroLocal}`,
                parametros: parametrosLocales,
            };
        }
        acumulador.where = acumulador.where + ' ' + (indiceLocal > 0 ? 'or' : '') + ' ' + wherePuroLocal.where;
        if (indiceLocal > 0) {
            acumulador.parametros = {...acumulador.parametros, ...wherePuroLocal.parametros};
        } else {
            acumulador.parametros = {...wherePuroLocal.parametros};
        }
        acumulador.conjuncion = 'and';
        return acumulador;
    };
}