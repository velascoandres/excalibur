import {SelectQueryBuilder} from 'typeorm';
import {separarAtributosSimplesCompuestosConsulta} from '../splitters/separarAtributosSimplesCompuestosConsulta';
import {verificarSiEsUnObjetoLleno} from '../verificators-functions/verificarSiEsUnObjetoLleno';
import {encontrarTipoRelacion} from '../splitters/encontrarTipoRelacion';
import {WherePuroInterface} from '../interfaces/wherePuro.interface';
import {armarWherePuro} from './armarWherePuroSimple';
import {armarWherePuroConOperador} from './armarWherePuroConOperador';
import {armarWhereOrPuro} from './armarWhereOrPuro';
import {RelacionPuraInterface} from '../interfaces/relacionPura.interface';

export function generarWhereRelacion(
    consulta: SelectQueryBuilder<{}>,
    nombreAtributo: string,
    valorAtributo: string | any,
    padre: string,
    tipoRelacion: 'left' | 'inner' = 'inner',
): SelectQueryBuilder<{}> {
    // Si la relacion tiene condiciones EJ: "diapositiva": {"habilitado": 1, "id": {"operacion":"In", "valores": [1,2,3]}}
    const estaLlenoObjeto = verificarSiEsUnObjetoLleno(valorAtributo);
    const relacion: string = `${padre}.${nombreAtributo}`;
    const alias: string = nombreAtributo;
    let condiciones = [];
    if (estaLlenoObjeto) {
        // separar simples de compuestos
        const atributosSimplesYCompuestos = separarAtributosSimplesCompuestosConsulta(valorAtributo);
        const subQuery = valorAtributo;
        // Armamos las condiciones
        const condicionesSimples = atributosSimplesYCompuestos.simples.reduce(
            (acumulador: WherePuroInterface[], subatributo: string) => {
                const wherePuroGenerado = armarWherePuro(
                    subatributo,
                    subQuery[subatributo],
                    nombreAtributo, // Nombre de la entidad hija
                );
                if (wherePuroGenerado) {
                    acumulador.push(wherePuroGenerado);
                }
                return acumulador;
            }, [],
        );
        const condicionesCompuestaConsulta = atributosSimplesYCompuestos.compuestoConsulta.reduce(
            (acumulador: WherePuroInterface[], subAatributo: string) => {
                const wherePuroConOperadorGenerado = armarWherePuroConOperador(
                    subAatributo,
                    subQuery[subAatributo],
                    nombreAtributo,
                );
                if (wherePuroConOperadorGenerado) {
                    acumulador.push(wherePuroConOperadorGenerado);
                }
                return acumulador;
            }, [],
        );
        const condicionesWhereOr = atributosSimplesYCompuestos.arregloOr.reduce(
            (acumulador: WherePuroInterface[], subAatributo: string) => {
                const whereOrPuroGenerado: WherePuroInterface = armarWhereOrPuro(
                    subAatributo,
                    subQuery[subAatributo],
                    nombreAtributo,
                );
                if (whereOrPuroGenerado) {
                    acumulador.push(whereOrPuroGenerado);
                }
                return acumulador;
            }, [],
        );
        // Todas las condiciones se las agrega a un arreglo de condiciones
        condiciones = [...condicionesSimples, ...condicionesCompuestaConsulta, ...condicionesWhereOr];
        // Establecemos el objeto de tipo relacionPurta este objeto sera el acumulador inicial
        const relacionPuraInicial: RelacionPuraInterface = {
            relacion,
            alias,
            condicion: '',
            parametros: {},
        };
        // generaremos un nuevo objeto de tipo relacion pura en base al acumlador inicial
        const relacionPura: RelacionPuraInterface = condiciones.reduce(
            (acumulador: RelacionPuraInterface, condicion: WherePuroInterface, indice: number) => {
                // juntar los where con las conjunciones
                if (indice > 0) {
                    acumulador.condicion = acumulador.condicion + ' ' + condicion.conjuncion + ' ' + condicion.where;
                } else {
                    acumulador.condicion = acumulador.condicion + ' ' + condicion.where;
                }
                // tslint:disable-next-line:max-line-length
                // acumulador.condicion = acumulador.condicion + ' ' + condicion.conjuncion ? condicion.conjuncion : '' + ' ' + condicion.where ? condicion.where : '';
                // juntar los parametros
                acumulador.parametros = {...acumulador.parametros, ...condicion.parametros};
                return acumulador;
            }, relacionPuraInicial,
        );
        if (tipoRelacion === 'inner') {
            consulta = consulta.innerJoinAndSelect(
                relacionPuraInicial.relacion, relacionPuraInicial.alias, relacionPuraInicial.condicion, relacionPura.parametros,
            );
            // console.log(relacionPuraInicial.relacion, relacionPuraInicial.alias, relacionPuraInicial.condicion, relacionPura.parametros);
        } else {
            consulta = consulta.leftJoinAndSelect(
                relacionPuraInicial.relacion, relacionPuraInicial.alias, relacionPuraInicial.condicion, relacionPura.parametros,
            );
        }
        // En caso de que tambien la relacion tuviera otras relaciones anidades se volvera a llamar a esta funcion
        // para los compuestos es recursivo,
        atributosSimplesYCompuestos.compuestos.forEach(
            (subatributo: string) => {
                const claseRelacion: 'inner' | 'left' = encontrarTipoRelacion(subQuery[subatributo]);
                consulta = generarWhereRelacion(
                    consulta,
                    subatributo,
                    subQuery[subatributo],
                    nombreAtributo,
                    claseRelacion,
                );
            },
        );
    } else {
        if (tipoRelacion === 'inner') {
            consulta = consulta.innerJoinAndSelect(
                `${padre}.${nombreAtributo}`, `${nombreAtributo}`,
                // `${padre}.${atributo}=${atributo}.id`,
            );
        } else {
            consulta = consulta.leftJoinAndSelect(
                `${padre}.${nombreAtributo}`, `${nombreAtributo}`,
                // `${padre}.${atributo}=${atributo}.id`,
            );
        }
    }
    return consulta;
}