import {SelectQueryBuilder} from 'typeorm';
import {OperadorConsultaSimpleInterface} from '../interfaces/operador.consulta.simple.interface';
import {WherePuroInterface} from '../interfaces/wherePuro.interface';
import {generarWhere} from './generarWhere';
import {armarWherePuro} from './armarWherePuroSimple';
import {esInterfazDeOperadorConsultaCompuesta} from '../funciones-verficadoras/esInterfazDeOperardorConsulta';
import {armarWherePuroConOperador} from './armarWherePuroConOperador';
import {OperadorConsultaInterface} from '../interfaces/operador.consulta.interface';

export function armarWhere(
    consulta: SelectQueryBuilder<{}>,
    atributo: string,
    valor: string | OperadorConsultaSimpleInterface | any[],
    entidad: string,
    indiceAtributo: number = 1,
): SelectQueryBuilder<{}> {
    const esArreglo = valor instanceof Array;
    if (esArreglo) {
        const valores = valor as any[];
        valores.forEach(
            (valorOr, indice: number) => {
                const tieneOperadorConsultaCompuesta = esInterfazDeOperadorConsultaCompuesta(valorOr);
                let wherePuroGenerado: WherePuroInterface | undefined;
                if (tieneOperadorConsultaCompuesta) {
                    valorOr = valorOr as OperadorConsultaInterface;
                    valorOr.conjuncion = 'or';
                    wherePuroGenerado = armarWherePuroConOperador(
                        atributo,
                        valorOr,
                        entidad,
                        indice,
                    );
                } else {
                    wherePuroGenerado = armarWherePuro(
                        atributo,
                        valorOr,
                        entidad,
                        indice,
                    );
                }
                if (wherePuroGenerado) {
                    consulta = generarWhere(
                        consulta,
                        wherePuroGenerado,
                        indice > 0 ? 'or' : 'and',
                    );
                }

            },
        );
        return consulta;
    }
    const wherePuroArmado: WherePuroInterface | undefined = armarWherePuro(
        atributo,
        valor,
        entidad,
        indiceAtributo,
    );
    return generarWhere(consulta, wherePuroArmado as WherePuroInterface, wherePuroArmado?.conjuncion as string);
}