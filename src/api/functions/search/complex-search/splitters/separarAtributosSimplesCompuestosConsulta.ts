import {ObjectLiteral} from 'typeorm';
import {VerificatorHelper} from '../verificators-functions/verificator-helper';

export function separarAtributosSimplesCompuestosConsulta(
    query: ObjectLiteral,
) {
    const listaAtributos = Object.keys(query);
    return listaAtributos.reduce(
        (acumulador: { simples: string[], compuestos: any[], compuestoConsulta: any[], arregloOr: any[] }, atributo: any) => {
            const valor = query[atributo];
            const esObjeto = VerificatorHelper.verifyIsObject(valor);
            const esArreglo = valor instanceof Array;
            // const esObjetoConsulta = esInterfazDeOperadorConsultaCompuesta(valor);
            const esObjetoConsulta = VerificatorHelper.isComplexOperatorObject(valor);
            if (esObjeto && !esObjetoConsulta) {
                acumulador.compuestos.push(atributo);
            }
            if (!esObjeto && !esObjetoConsulta && !esArreglo) {
                acumulador.simples.push(atributo);
            }
            if (esObjetoConsulta) {
                acumulador.compuestoConsulta.push(atributo);
            }
            if (esArreglo){
                acumulador.arregloOr.push(atributo);
            }
            return acumulador;
        }, {simples: [], compuestos: [], compuestoConsulta: [], arregloOr: []},
    );
}