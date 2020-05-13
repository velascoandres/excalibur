"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.borrarArhicvo = void 0;
// tslint:disable-next-line:no-var-requires
const fs = require('fs');
function borrarArhicvo(path) {
    return new Promise((resolve, reject) => {
        fs.unlink(path, (err) => {
            if (err) {
                reject(err);
            }
            else {
                resolve('ok');
            }
        });
    });
}
exports.borrarArhicvo = borrarArhicvo;
