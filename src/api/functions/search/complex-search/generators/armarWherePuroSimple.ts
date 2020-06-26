import {OperadorConsultaSimpleInterface} from '../../../../..';
import {WherePuroInterface} from '../interfaces/wherePuro.interface';
import {ObjectLiteral} from 'typeorm';
import {VerificatorHelper} from '../verificators-functions/verificator-helper';

export function armarWherePuro(
    atributo: string,
    valor: string | OperadorConsultaSimpleInterface | Array<any>,
    entidad: string,
    indice: number = 1,
): WherePuroInterface | undefined {
    const strLlaveParametro = `valorAtributo${indice}${entidad}${atributo}`;
    const parametros: ObjectLiteral = {};
    if (atributo !== 'pjoin') {
        const tieneOperadorSimple = VerificatorHelper.IsSimpleOperatorQueryInterface(valor);
        if (tieneOperadorSimple) {
            valor = valor as OperadorConsultaSimpleInterface;
            const conjuncion = valor.conjunction ? valor.conjunction : 'and';
            const valores = valor.values instanceof Array ? [...valor.values] : [valor.values];
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