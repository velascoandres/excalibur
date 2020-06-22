import {SelectQueryBuilder} from 'typeorm';
import {verificarSiEsObjeto} from '../verificators-functions/verificarSiEsObjeto';
import {generarWhereRelacion} from './armarWhereConRelacion';
import {encontrarTipoRelacion} from '../splitters/encontrarTipoRelacion';
import {
    isComplexOperatorObject
} from '../verificators-functions/esInterfazDeOperardorConsulta';
import {generateWhere} from './generate-where';
import {armarWhereConOperador} from './armarWhereConOperador';

// Esta es la funcion api-principal en donde primero se itera a la raiz
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
            // const tieneOperadorConsultaCompuesta = esInterfazDeOperadorConsultaCompuesta(valorAtributo);
            const tieneOperadorConsultaCompuesta = isComplexOperatorObject(valorAtributo);
            // Si es un objeto y no tiene consultaCompuesta entonces debe ser una relacion join.
            const esRelacionJoin = esObjeto && !tieneOperadorConsultaCompuesta;
            if (tieneOperadorConsultaCompuesta) {
                consulta = armarWhereConOperador(consulta, nombreAtributo, valorAtributo, padre);
            }
            if (!tieneOperadorConsultaCompuesta && !esObjeto) {
                consulta = generateWhere(consulta, nombreAtributo, valorAtributo, padre);
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