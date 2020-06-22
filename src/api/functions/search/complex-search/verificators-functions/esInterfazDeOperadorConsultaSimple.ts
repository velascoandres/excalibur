export function esInterfazDeOperadorConsultaSimple(objecto: any): boolean {
    const tienePropiedades = objecto.conjuncion && objecto.valores;
    if (tienePropiedades) {
        if (objecto.conjuncion === 'or' && objecto.conjuncion === 'and') {
            return true;
        }
    }
    return false;
}