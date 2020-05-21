export function esInterfazDeOperadorConsultaCompuesta(object: any): boolean {
    const tienePropiedades = object.operacion && object.valores;
    if (tienePropiedades) {
        if (
            object.operacion === 'In' ||
            object.operacion === 'NotIn' ||
            object.operacion === 'Between' ||
            object.operacion === 'Like' ||
            object.operacion === 'Not' ||
            object.operacion === 'NotEqual' ||
            object.operacion === 'LessThan' ||
            object.operacion === 'MoreThan' ||
            object.operacion === 'ILike' ||
            object.operacion === 'LessThanEq' ||
            object.operacion === 'MoreThanEq'
        ) {
            if (typeof object.valores === 'number' || typeof object.valores === 'string' || (object.valores && object.valores.length >= 0) ){
                return true;
            }
        }
    }
    return false;
}