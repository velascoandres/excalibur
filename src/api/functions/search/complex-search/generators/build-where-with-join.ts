import {SelectQueryBuilder} from 'typeorm';
import {separarAtributosSimplesCompuestosConsulta} from '../splitters/separarAtributosSimplesCompuestosConsulta';
import {findJoinRelationType} from '../splitters/findJoinRelationType';
import {WherePuroInterface} from '../interfaces/wherePuro.interface';
import {armarWherePuro} from './armarWherePuroSimple';
import {buildPureWhereWithOperator} from './build-pure-where-with-operator';
import {armarWhereOrPuro} from './armarWhereOrPuro';
import {PureRelationInterface} from '../interfaces/pureRelationInterface';
import {VerificatorHelper} from '../verificators-functions/verificator-helper';

export function buildWhereWithjoin(
    currentSelectQuieryBuilder: SelectQueryBuilder<{}>,
    attributeName: string,
    attributeValue: string | any,
    parentEntity: string,
    joinType: 'left' | 'inner' = 'inner',
): SelectQueryBuilder<{}> {
    // Si la relacion tiene condiciones EJ: "producto": {"habilitado": 1, "id": {"operacion":"In", "valores": [1,2,3]}}
    const objectIsNotEmpty = VerificatorHelper.verifyIsNotEmptyObject(attributeValue);
    const relation: string = `${parentEntity}.${attributeName}`;
    const alias: string = attributeName;
    let conditions = [];
    if (objectIsNotEmpty) {
        // separar simples de compuestos
        const attributesSimplesAndComplexObject = separarAtributosSimplesCompuestosConsulta(attributeValue);
        const subQueryObject = attributeValue;
        // Armamos las condiciones
        const simpleQueryConditions = attributesSimplesAndComplexObject.simples.reduce(
            (acumulator: WherePuroInterface[], subAttribute: string) => {
                const generatedPureWhere = armarWherePuro(
                    subAttribute,
                    subQueryObject[subAttribute],
                    attributeName, // Nombre de la entidad hija
                );
                if (generatedPureWhere) {
                    acumulator.push(generatedPureWhere);
                }
                return acumulator;
            }, [],
        );
        const complexQueryConditions = attributesSimplesAndComplexObject.compuestoConsulta.reduce(
            (acumulator: WherePuroInterface[], subAttribute: string) => {
                const generatedPureWhereWithOperator = buildPureWhereWithOperator(
                    subAttribute,
                    subQueryObject[subAttribute],
                    attributeName,
                );
                if (generatedPureWhereWithOperator) {
                    acumulator.push(generatedPureWhereWithOperator);
                }
                return acumulator;
            }, [],
        );
        const whereOrConditions = attributesSimplesAndComplexObject.arregloOr.reduce(
            (acumulator: WherePuroInterface[], subAatributo: string) => {
                const pureWhereOrGenerated: WherePuroInterface = armarWhereOrPuro(
                    subAatributo,
                    subQueryObject[subAatributo],
                    attributeName,
                );
                if (pureWhereOrGenerated) {
                    acumulator.push(pureWhereOrGenerated);
                }
                return acumulator;
            }, [],
        );
        // Todas las condiciones se las agrega a un arreglo de condiciones
        conditions = [...simpleQueryConditions, ...complexQueryConditions, ...whereOrConditions];
        // Establecemos el objeto de tipo relacionPurta este objeto sera el acumulador inicial
        const basePureRelation: PureRelationInterface = {
            relation,
            alias,
            condition: '',
            parameters: {},
        };
        // generaremos un nuevo objeto de tipo relacion pura en base al acumlador inicial
        const pureJoinRelation: PureRelationInterface = conditions.reduce(
            (acumulator: PureRelationInterface, condition: WherePuroInterface, index: number) => {
                // juntar los where con las conjunciones
                if (index > 0) {
                    acumulator.condition = acumulator.condition + ' ' + condition.conjuncion + ' ' + condition.where;
                } else {
                    acumulator.condition = acumulator.condition + ' ' + condition.where;
                }
                // juntar los parametros
                acumulator.parameters = {...acumulator.parameters, ...condition.parametros};
                return acumulator;
            }, basePureRelation,
        );
        if (joinType === 'inner') {
            currentSelectQuieryBuilder = currentSelectQuieryBuilder.innerJoinAndSelect(
                basePureRelation.relation, basePureRelation.alias, basePureRelation.condition, pureJoinRelation.parameters,
            );
        } else {
            currentSelectQuieryBuilder = currentSelectQuieryBuilder.leftJoinAndSelect(
                basePureRelation.relation, basePureRelation.alias, basePureRelation.condition, pureJoinRelation.parameters,
            );
        }
        // En caso de que tambien la relacion tuviera otras relaciones anidades se volvera a llamar a esta funcion
        // para los compuestos es recursivo,
        attributesSimplesAndComplexObject.compuestos.forEach(
            (subattribute: string) => {
                const joinRelationType: 'inner' | 'left' = findJoinRelationType(subQueryObject[subattribute]);
                currentSelectQuieryBuilder = buildWhereWithjoin(
                    currentSelectQuieryBuilder,
                    subattribute,
                    subQueryObject[subattribute],
                    attributeName,
                    joinRelationType,
                );
            },
        );
    } else {
        if (joinType === 'inner') {
            currentSelectQuieryBuilder = currentSelectQuieryBuilder.innerJoinAndSelect(
                `${parentEntity}.${attributeName}`, `${attributeName}`,
            );
        } else {
            currentSelectQuieryBuilder = currentSelectQuieryBuilder.leftJoinAndSelect(
                `${parentEntity}.${attributeName}`, `${attributeName}`,
            );
        }
    }
    return currentSelectQuieryBuilder;
}