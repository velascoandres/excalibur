import { FindManyOptions, Repository } from 'typeorm';
export declare class ServicioPrincipal<Entidad> {
    private readonly _filaRepository;
    constructor(_filaRepository: Repository<Entidad>);
    crear(fila: Entidad | any): Promise<Entidad | undefined>;
    editar(id: number, fila: Entidad | any): Promise<Entidad | undefined>;
    borrar(idRegistro: number): Promise<Entidad | string>;
    listar(parametros?: FindManyOptions<Entidad | any>): Promise<[Entidad[], number]>;
    buscarUnoPorParemtros(parametros?: FindManyOptions<Entidad>): Promise<Entidad[] | any>;
    buscarPorId(id: number): Promise<Entidad | undefined>;
}
//# sourceMappingURL=servicio.principal.d.ts.map