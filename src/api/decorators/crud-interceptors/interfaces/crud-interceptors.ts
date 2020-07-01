import {NestInterceptor} from '@nestjs/common';

export type CrudInterceptors = (NestInterceptor | Function)[];

export interface CrudInterceptorsConfig {
    createOne?: CrudInterceptors;
    updateOne?: CrudInterceptors;
    findAll?: CrudInterceptors;
    deleteOne?: CrudInterceptors;
    findOneById?: CrudInterceptors;
}