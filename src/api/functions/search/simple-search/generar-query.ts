import {FindManyOptions, Like} from 'typeorm';
import {convertirStringArreglo} from './utils/convertir-string-arreglo';

export function generarQuery(parametro: any) {
    const llaves = Object.keys(parametro);
    let query: FindManyOptions = {
        order: {id: 'DESC'},
        skip: 0,
        take: 5,
    };
    llaves.forEach((llave: string) => {
            switch (llave) {
                case 'where':
                    const parametrosWhere = JSON.parse(parametro[llave]); // {nombre: {like: 'abc'}}
                    const valoresParametroWhere = Object.values(parametrosWhere); // [{'like':'abc'}, ...]
                    const llavesParametroWhere = Object.keys(parametrosWhere); // ['nombre',...]
                    valoresParametroWhere.forEach((valor: any, index) => {
                            if (typeof valor === 'object') {
                                const llavesGeneradas = Object.keys(valor);
                                llavesGeneradas.forEach(subLlave => {
                                    if (subLlave === 'like') {
                                        parametrosWhere[llavesParametroWhere[index]] = Like(
                                            `%${valor.like}%`,
                                        );
                                    }
                                });
                            }
                        },
                    );
                    query.where = parametrosWhere;
                    break;
                case 'relations':
                    query.relations = convertirStringArreglo(parametro[llave]);
                    break;
                case 'order':
                    query.order = JSON.parse(parametro[llave]);
                    break;
                case 'skip':
                    query.skip = !isNaN(+parametro[llave]) ? +parametro[llave] : 0;
                    break;
                case 'take':
                    query.take = !isNaN(+parametro[llave]) ? +parametro[llave] : 0;
                    break;
                default:
                    query = {};
                    break;
            }
        },
    );
    return query;
}
