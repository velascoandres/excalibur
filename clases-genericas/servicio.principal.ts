import { FindManyOptions, Repository, UpdateResult } from 'typeorm';

export class ServicioPrincipal<Entidad> {
  constructor(private readonly _filaRepository: Repository<Entidad>) {}

  async crear(fila: Entidad | any): Promise<Entidad | undefined> {
    const filaInstanciado: any = await this._filaRepository.create(fila);
    const filaCreado = await this._filaRepository.save(filaInstanciado); // Conectarse a la db
    const filaConRelaciones = await this._filaRepository.findOne(filaCreado.id);
    return filaConRelaciones;
  }

  async editar(
    id: number,
    fila: Entidad | any,
  ): Promise<Entidad | undefined> {
    const registroActualizado = await this._filaRepository.update(id, fila);
    const registro = await this._filaRepository.findOne(id);
    return registro;
  }

  async borrar(idRegistro: number): Promise<Entidad | string> {
    // CREA UNA INSTANCIA DE LA ENTIDAD
    const registroEliminar = await this.buscarPorId(idRegistro);
    if (registroEliminar) {
      return this._filaRepository.remove(registroEliminar);
    } else {
      return 'No existe el registro';
    }
  }

  async listar(
    parametros?: FindManyOptions<Entidad | any>,
  ): Promise<[Entidad[], number]> {
    const registros = await this._filaRepository.findAndCount(parametros);
    return registros;
  }
  async buscarUnoPorParemtros(
    parametros?: FindManyOptions<Entidad>,
  ): Promise<Entidad[] | any> {
    const registros = await this._filaRepository.findOne(parametros);
    return registros;
  }
  buscarPorId(id: number): Promise<Entidad | undefined> {
    return this._filaRepository.findOne(id);
  }
}
