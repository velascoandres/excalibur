export interface RespuestaPrincipalInterface<Entidad> {
    data: string | Entidad[] | Entidad;
    error?: boolean;
    statusCode?: number;
    total?: number;
    mensaje?: string;
    registro?: any;
}
//# sourceMappingURL=respuesta.principal.interface.d.ts.map