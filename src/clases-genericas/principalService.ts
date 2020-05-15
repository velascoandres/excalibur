import {FindManyOptions, Repository} from 'typeorm';
import {NotFoundException} from '@nestjs/common';

export class PrincipalService<Entidad> {
  constructor(private readonly _filaRepository: Repository<Entidad>) {}

  async createOne(fila: Entidad | any): Promise<Entidad | undefined> {
    const filaInstanciado: any = await this._filaRepository.create(fila);
    const filaCreado = await this._filaRepository.save(filaInstanciado); // Conectarse a la db
    return await this._filaRepository.findOne(filaCreado.id);
  }

  async updateOne(
    id: number,
    fila: Entidad | any,
  ): Promise<Entidad> {
    const registroActualizado = await this._filaRepository.update(id, fila);
    return await this._filaRepository.findOne(id) as Entidad;
  }

  async deleteOne(idRegistro: number): Promise<Entidad> {
    // CREA UNA INSTANCIA DE LA ENTIDAD
    const registroEliminar = await this.findOneById(idRegistro);
    if (registroEliminar) {
      return this._filaRepository.remove(registroEliminar);
    } else {
      throw new NotFoundException('No existe el registro');
    }
  }

  async findAll(
    parametros?: FindManyOptions<Entidad | any>,
  ): Promise<[Entidad[], number]> {
    return await this._filaRepository.findAndCount(parametros);
  }
  async findOne(
    parametros?: FindManyOptions<Entidad>,
  ): Promise<Entidad> {
    return await this._filaRepository.findOne(parametros) as Entidad;
  }
  async findOneById(id: number): Promise<Entidad> {
    return await this._filaRepository.findOne(id) as Entidad;
  }
}
