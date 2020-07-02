import {NestInterceptor} from '@nestjs/common';
import {CrudMethodsInterface} from '../../../interfaces/crud-methods.interface';

export type CrudInterceptors = (NestInterceptor | Function)[];

export interface CrudInterceptorsConfig extends CrudMethodsInterface{
    createOne?: CrudInterceptors;
    updateOne?: CrudInterceptors;
    findAll?: CrudInterceptors;
    deleteOne?: CrudInterceptors;
    findOneById?: CrudInterceptors;
}