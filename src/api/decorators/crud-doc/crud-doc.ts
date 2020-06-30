import {CrudApiDocConfig} from './interfaces';
import {DecoratorHelper} from '../../..';

// Implementacion del decorador CrudDoc
// Este decorador sirve para generar la documentacion de la API para los metodos -> Crud
export function CrudDoc(
    options: CrudApiDocConfig,
): ClassDecorator {
    return (target: any) => {
        return  DecoratorHelper.makeCrudDoc(options, target);
    };
}
