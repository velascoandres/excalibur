import {EntityManager} from 'typeorm';

export interface TransactionResponse<T> {
    entityManager: EntityManager;
    response: T;
}