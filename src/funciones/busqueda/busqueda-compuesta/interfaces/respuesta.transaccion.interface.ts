import {EntityManager} from 'typeorm';

export interface RespuestaTransaccionInterface<T> {
    transaccionManager: EntityManager;
    respuesta: T;
}