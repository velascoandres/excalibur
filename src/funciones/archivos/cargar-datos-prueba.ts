import { ServicioPrincipal } from "../../clases-genericas/servicio.principal";

// @ts-ignore
declare var require: any;
// tslint:disable-next-line:no-var-requires
const fs = require('fs');
export async function crearDatos(pathArchivo: string, service: ServicioPrincipal<any>) {
  try {
    return new Promise((resolve, reject) => {
      fs.readFile(pathArchivo, 'UTF-8', (err: any, data: string) => {
        if (err) {
          reject(err);
        } else {
          resolve(service.crear(JSON.parse(data)));
        }
      });
    });
  } catch (e) {
    console.error('error crear', e);
  }
}
