import {SelectQueryBuilder} from 'typeorm';
import {ConsultaFindFullInterface} from '../interfaces/consulta.findFull.interface';
import {generarQuery} from '../generators/generarQuery';
import {OrderByInterface} from '../interfaces/orderBy.interface';

export async function buscarRegistros(
    consulta: SelectQueryBuilder<{}>,
    query: ConsultaFindFullInterface,
): Promise<[{}[], number]> {
    const sqlQuery = await generarQuery(consulta, query.where);
    const tieneSkip = !!query.skip;
    const tieneTake = !!query.take;
    const tieneOrderBy = !!query.orderBy;
    let respuestaConsulta: SelectQueryBuilder<{}>;
    let skip: number | undefined = 0;
    let take: number | undefined = 10;
    let orderBy: OrderByInterface | undefined  = {
        'entidadBase.id': 'DESC',
    };
    if (tieneOrderBy) {
        orderBy = query.orderBy;
    }
    if (tieneSkip) {
        skip = query.skip;
    }
    if (tieneTake) {
        take = query.take;
    }
    if (skip === 0 && take === 0) {
        respuestaConsulta = await sqlQuery.orderBy(orderBy as OrderByInterface);
    } else {
        respuestaConsulta = await sqlQuery.orderBy(orderBy as OrderByInterface).skip(skip).take(take);
    }
    // console.log(respuestaConsulta.getSql());
    return respuestaConsulta.getManyAndCount();
}