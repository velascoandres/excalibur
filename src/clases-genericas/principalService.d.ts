import { FindManyOptions, Repository } from 'typeorm';
export declare abstract class PrincipalService<Entidad> {
    private readonly _filaRepository;
    protected constructor(_filaRepository: Repository<Entidad>);
    createOne(fila: Entidad | any): Promise<Entidad>;
    updateOne(id: number, fila: Entidad | any): Promise<Entidad>;
    deleteOne(idRegistro: number): Promise<Entidad>;
    findAll(parametros?: FindManyOptions<Entidad | any>): Promise<[Entidad[], number]>;
    findOne(parametros?: FindManyOptions<Entidad>): Promise<Entidad>;
    findOneById(id: number): Promise<Entidad>;
}
