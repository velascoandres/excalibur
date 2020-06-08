import {DeepPartial, FindManyOptions, Repository} from 'typeorm';
import {NotFoundException} from '@nestjs/common';
import {findFull} from '../../index';
import {ConsultaFindFullInterface} from '../../index';
import {ServiceCrudMethodsInterface} from '../interfaces/service.crud.methods.interfaces';

export abstract class PrincipalService<Entidad> implements ServiceCrudMethodsInterface<Entidad>{
    protected constructor(
        private readonly _filaRepository: Repository<Entidad>,
    ) {
    }

    async createOne(fila: DeepPartial<Entidad>): Promise<Entidad> {
        const filaInstanciado: any = await this._filaRepository.create(fila);
        // Conectarse a la db
        const filaCreado = await this._filaRepository.save(filaInstanciado);
        return await this._filaRepository.findOne(filaCreado.id) as Entidad;
    }

    async updateOne(
        id: number,
        fila: DeepPartial<Entidad>,
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
        parametros?: ConsultaFindFullInterface,
    ): Promise<[Entidad[], number]> {
        const tieneParametros = parametros && Object.keys(parametros).length > 0;
        if (!tieneParametros) {
            return await this._filaRepository.findAndCount({skip: 0, take: 10});
        } else {
            const nombreTabla: string = this._filaRepository.metadata.tableName;
            const conexion: string = this._filaRepository.metadata.connection.name;
            return await findFull<Entidad>(nombreTabla, parametros as ConsultaFindFullInterface, conexion);
        }
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
