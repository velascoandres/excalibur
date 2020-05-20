import {OperadorConsultaInterface} from '../interfaces/operador.consulta.interface';
import {WherePuroInterface} from '../interfaces/wherePuro.interface';
import {ObjectLiteral} from 'typeorm';

export function armarWherePuroConOperador(
    atributo: string,
    valorConOperador: OperadorConsultaInterface,
    entidad: string,
    indice: number = 1,
): WherePuroInterface | undefined {
    const operador = valorConOperador.operacion;
    const strLlaveParametro = `valorAtributo${indice}${entidad}${atributo}`;
    const parametros: ObjectLiteral = {};
    let conjuncion = 'and';
    if (valorConOperador.conjuncion) {
        conjuncion = valorConOperador.conjuncion;
    }
    const valorEsArreglo = valorConOperador.valores instanceof Array;
    let valoresAComparar: any = valorConOperador.valores;
    if (!valorEsArreglo) {
        valoresAComparar = [valorConOperador.valores];
    }
    const wherePuro: WherePuroInterface = {where: '', parametros: {}, conjuncion};
    switch (operador) {
        case 'In':
            wherePuro.where = `${entidad}.${atributo} In(${valoresAComparar.join()})`;
            return wherePuro;
        case 'NotIn':
            wherePuro.where = `${entidad}.${atributo} Not In(${valoresAComparar.join(',')})`;
            return wherePuro;

        case 'Between':
            wherePuro.where = `${entidad}.${atributo} Between(${valoresAComparar.join(',')})`;
            return wherePuro;

        case 'Like':
            parametros[strLlaveParametro] = valoresAComparar[0];
            // El valor a comparar ya debe venir con las respectivas wildcards
            // wildcards: %, _, [], ^, -
            wherePuro.where = `${entidad}.${atributo} like :${strLlaveParametro}`;
            wherePuro.parametros = parametros;
            return wherePuro;

        case 'ILike':
            parametros[strLlaveParametro] = valoresAComparar[0];
            // El valor a comparar ya debe venir con las respectivas wildcards
            // wildcards: %, _, [], ^, -
            wherePuro.where = `${entidad}.${atributo} ilike :${strLlaveParametro}`;
            wherePuro.parametros = parametros;
            return wherePuro;

        case 'Not':
            parametros[strLlaveParametro] = valoresAComparar[0];
            wherePuro.where = `${entidad}.${atributo} Not :${strLlaveParametro}`;
            wherePuro.parametros = parametros;
            return wherePuro;

        case 'NotEqual':
            parametros[strLlaveParametro] = valoresAComparar[0];
            wherePuro.where = `${entidad}.${atributo} != :${strLlaveParametro}`;
            wherePuro.parametros = parametros;
            return wherePuro;

        case 'LessThan':
            parametros[strLlaveParametro] = valoresAComparar[0];
            wherePuro.where = `${entidad}.${atributo} < :${strLlaveParametro}`;
            wherePuro.parametros = parametros;
            return wherePuro;

        case 'MoreThan':
            parametros[strLlaveParametro] = valoresAComparar[0];
            wherePuro.where = `${entidad}.${atributo} > :${strLlaveParametro}`;
            wherePuro.parametros = parametros;
            return wherePuro;

        case 'LessThanEq':
            parametros[strLlaveParametro] = valoresAComparar[0];
            wherePuro.where = `${entidad}.${atributo} <= :${strLlaveParametro}`;
            wherePuro.parametros = parametros;
            return wherePuro;

        case 'MoreThanEq':
            parametros[strLlaveParametro] = valoresAComparar[0];
            wherePuro.where = `${entidad}.${atributo} >= :${strLlaveParametro}`;
            wherePuro.parametros = parametros;
            return wherePuro;

        default:
            return undefined;
    }
}