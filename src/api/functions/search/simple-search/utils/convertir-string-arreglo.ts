export function convertirStringArreglo(cadena: string) {
    const longitud = cadena.length;
    const posicionFinal = longitud - 1;
    const soloTexto = cadena.slice(1, posicionFinal);
    return soloTexto.split(',');
}