import { ServicioPrincipal } from './servicio.principal';
import { RespuestaPrincipalInterface } from '../interfaces/respuesta.principal.interface';
import { FindManyOptions, UpdateResult } from 'typeorm';
export declare class ControladorPrincipal<Entidad> {
    private readonly _principalService;
    nombreClaseDtoEditar: any;
    nombreClaseDtoCrear: any;
    constructor(_principalService: ServicioPrincipal<Entidad>);
    crear(nuevo: Entidad): Promise<Entidad>;
    editar(datosActualizar: Entidad, id: number): Promise<RespuestaPrincipalInterface<Entidad | UpdateResult | any>>;
    eliminar(id: number): Promise<RespuestaPrincipalInterface<Entidad>>;
    buscarPorId(id: number): Promise<Entidad>;
    buscarTodos(criteriosBusqueda: any): Promise<[Entidad[], number]>;
}
export declare function convertirStringArreglo(cadena: string): string[];
export declare function generarQuery(parametro: any): FindManyOptions<any>;
//# sourceMappingURL=controlador.principal.d.ts.map