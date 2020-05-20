export function verificarSiEsUnObjetoLleno(objeto: any): boolean {
    const llaves = Object.keys(objeto);
    return llaves.length > 0;
}