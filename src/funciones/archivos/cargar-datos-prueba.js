"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.crearDatos = void 0;
const fs = require('fs');
async function crearDatos(pathArchivo, service) {
    try {
        return new Promise((resolve, reject) => {
            fs.readFile(pathArchivo, 'UTF-8', (err, data) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(service.createOne(JSON.parse(data)));
                }
            });
        });
    }
    catch (e) {
        console.error('error crear', e);
    }
}
exports.crearDatos = crearDatos;
//# sourceMappingURL=cargar-datos-prueba.js.map