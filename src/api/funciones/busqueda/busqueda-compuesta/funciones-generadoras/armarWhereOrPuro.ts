import {reducirWhereFuncional} from '../funciones-reductoras/reducir-where-funcional';
import {OperadorConsultaSimpleInterface} from '../interfaces/operador.consulta.simple.interface';
import {WherePuroInterface} from '../interfaces/wherePuro.interface';

export function armarWhereOrPuro(
    atributo: string,
    valor: string | OperadorConsultaSimpleInterface | Array<any>,
    entidad: string,
    indice: number = 1,
): WherePuroInterface {
    const arregloValores = valor as Array<any>;
    return arregloValores.reduce(
        reducirWhereFuncional(entidad, atributo),
        {parametros: {}, where: ''},
    );
}