import {verificarSiEsObjeto} from '../funciones-verficadoras/verificarSiEsObjeto';
import {esInterfazDeOperadorConsultaCompuesta} from '../funciones-verficadoras/esInterfazDeOperardorConsulta';
import {ObjectLiteral} from 'typeorm';

export function separarAtributosSimplesCompuestosConsulta(
    query: ObjectLiteral,
) {
    const listaAtributos = Object.keys(query);
    return listaAtributos.reduce(
        (acumulador: { simples: string[], compuestos: any[], compuestoConsulta: any[], arregloOr: any[] }, atributo: any) => {
            const valor = query[atributo];
            const esObjeto = verificarSiEsObjeto(valor);
            const esArreglo = valor instanceof Array;
            const esObjetoConsulta = esInterfazDeOperadorConsultaCompuesta(valor);
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