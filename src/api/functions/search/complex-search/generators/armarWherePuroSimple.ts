import {OperadorConsultaSimpleInterface} from '../interfaces/operador.consulta.simple.interface';
import {esInterfazDeOperadorConsultaSimple} from '../verificators-functions/esInterfazDeOperadorConsultaSimple';
import {WherePuroInterface} from '../interfaces/wherePuro.interface';
import {ObjectLiteral} from 'typeorm';

export function armarWherePuro(
    atributo: string,
    valor: string | OperadorConsultaSimpleInterface | Array<any>,
    entidad: string,
    indice: number = 1,
): WherePuroInterface | undefined {
    const strLlaveParametro = `valorAtributo${indice}${entidad}${atributo}`;
    const parametros: ObjectLiteral = {};
    if (atributo !== 'pjoin') {
        const tieneOperadorSimple = esInterfazDeOperadorConsultaSimple(valor);
        if (tieneOperadorSimple) {
            valor = valor as OperadorConsultaSimpleInterface;
            const conjuncion = valor.conjuncion ? valor.conjuncion : 'and';
            const valores = valor.valores instanceof Array ? [...valor.valores] : [valor.valores];
            parametros[strLlaveParametro] = valores.join(',');
            return {
                where: `${entidad}.${atributo}=:${strLlaveParametro}`,
                parametros,
                conjuncion,
            };
        } else {
            parametros[strLlaveParametro] = valor;
            return {
                where: `${entidad}.${atributo}=:${strLlaveParametro}`,
                parametros,
                conjuncion: 'and',
            };
        }
    } else {
        return undefined;
    }
}