export function verificarSiEsObjeto(valor: any) {
    return valor !== null && (typeof valor === 'object') && !(valor instanceof Array);
}
