// @ts-ignore
declare var require: any;
// tslint:disable-next-line:no-var-requires
const fs = require('fs');

export function borrarArhicvo(path: string) {
  return new Promise((resolve, reject) => {
    fs.unlink(path, (err: any) => {
      if (err) {
        reject(err);
      } else {
        resolve('ok');
      }
    });
  });
}
