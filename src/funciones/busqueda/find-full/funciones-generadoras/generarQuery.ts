import {SelectQueryBuilder} from 'typeorm';
import {verificarSiEsObjeto} from '../funciones-verficadoras/verificarSiEsObjeto';
import {generarWhereRelacion} from './armarWhereConRelacion';
import {encontrarTipoRelacion} from '../funciones-separadoras/encontrarTipoRelacion';
import {esInterfazDeOperadorConsultaCompuesta} from '../funciones-verficadoras/esInterfazDeOperardorConsulta';
import {armarWhere} from './armarWhere';
import {armarWhereConOperador} from './armarWhereConOperador';

// Esta es la funcion principal en donde primero se itera a la raiz
export async function generarQuery(
    consulta: SelectQueryBuilder<{}>,
    query: { [x: string]: any; },
    padre: string = 'entidadBase',
): Promise<SelectQueryBuilder<{}>> {
    const atributos = Object.keys(query);
    await atributos.forEach(
        (nombreAtributo: string) => {
            const valorAtributo = query[nombreAtributo];
            // Si el valor del atributo es un objeto
            const esObjeto = verificarSiEsObjeto(valorAtributo);
            // Si el valor del atributo es un objeto del tipo consulta compuesta
            const tieneOperadorConsultaCompuesta = esInterfazDeOperadorConsultaCompuesta(valorAtributo);
            // Si es un objeto y no tiene consultaCompuesta entonces debe ser una relacion join.
            const esRelacionJoin = esObjeto && !tieneOperadorConsultaCompuesta;
            if (tieneOperadorConsultaCompuesta) {
                consulta = armarWhereConOperador(consulta, nombreAtributo, valorAtributo, padre);
            }
            if (!tieneOperadorConsultaCompuesta && !esObjeto) {
                consulta = armarWhere(consulta, nombreAtributo, valorAtributo, padre);
            }
            if (esRelacionJoin) {
                const tipoRelacion: 'inner' | 'left' = encontrarTipoRelacion(query[nombreAtributo]);
                consulta = generarWhereRelacion(
                    consulta,
                    nombreAtributo,
                    valorAtributo,
                    padre,
                    tipoRelacion,
                );
            }
        },
    );
    return consulta;
}