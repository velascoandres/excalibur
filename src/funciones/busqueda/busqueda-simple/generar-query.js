"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generarQuery = void 0;
const typeorm_1 = require("typeorm");
const convertir_string_arreglo_1 = require("../../utilitarias/convertir-string-arreglo");
function generarQuery(parametro) {
    const llaves = Object.keys(parametro);
    const query = {
        order: { id: 'DESC' },
        skip: 0,
        take: 5,
    };
    llaves.forEach((llave) => {
        switch (llave) {
            case 'where':
                const parametrosWhere = JSON.parse(parametro[llave]);
                const valoresParametroWhere = Object.values(parametrosWhere);
                const llavesParametroWhere = Object.keys(parametrosWhere);
                valoresParametroWhere.forEach((valor, index) => {
                    if (typeof valor === 'object') {
                        const llavesGeneradas = Object.keys(valor);
                        llavesGeneradas.forEach(subLlave => {
                            if (subLlave === 'like') {
                                parametrosWhere[llavesParametroWhere[index]] = typeorm_1.Like(`%${valor.like}%`);
                            }
                        });
                    }
                });
                query.where = parametrosWhere;
                break;
            case 'relations':
                query.relations = convertir_string_arreglo_1.convertirStringArreglo(parametro[llave]);
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
        }
    });
    return query;
}
exports.generarQuery = generarQuery;
//# sourceMappingURL=generar-query.js.map