import {CuerpoConsultaFindFull} from '../interfaces/cuerpo.consulta.findFull';

export function encontrarTipoRelacion(subquery: CuerpoConsultaFindFull): 'inner' | 'left' {
    const existeRelacion = !!subquery.pjoin;
    if (existeRelacion) {
        return subquery.pjoin as 'left';
    } else {
        return 'inner';
    }
}