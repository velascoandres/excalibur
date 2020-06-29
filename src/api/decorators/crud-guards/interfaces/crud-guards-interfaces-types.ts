import {CanActivate} from '@nestjs/common';

export type CrudGuards = (CanActivate | Function)[];

export interface CrudGuardConfigOptions {
    createOne?: CrudGuards;
    updateOne?: CrudGuards;
    findAll?: CrudGuards;
    deleteOne?: CrudGuards;
    findOneById?: CrudGuards;
}