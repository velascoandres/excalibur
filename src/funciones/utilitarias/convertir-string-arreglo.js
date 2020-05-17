"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertirStringArreglo = void 0;
function convertirStringArreglo(cadena) {
    const longitud = cadena.length;
    const posicionFinal = longitud - 1;
    const soloTexto = cadena.slice(1, posicionFinal);
    return soloTexto.split(',');
}
exports.convertirStringArreglo = convertirStringArreglo;
//# sourceMappingURL=convertir-string-arreglo.js.map