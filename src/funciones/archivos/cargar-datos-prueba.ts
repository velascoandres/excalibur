import {PrincipalService} from '../..';

declare var require: any;
// tslint:disable-next-line:no-var-requires
const fs = require('fs');
export async function crearDatos(pathArchivo: string, service: PrincipalService<any>) {
  try {
    return new Promise((resolve, reject) => {
      fs.readFile(pathArchivo, 'UTF-8', (err: any, data: string) => {
        if (err) {
          reject(err);
        } else {
          resolve(service.createOne(JSON.parse(data)));
        }
      });
    });
  } catch (e) {
    console.error('error crear', e);
  }
}
