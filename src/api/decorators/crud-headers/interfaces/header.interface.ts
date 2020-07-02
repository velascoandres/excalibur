import {CrudMethodsInterface} from '../../../interfaces/crud-methods.interface';

export interface HeaderInterface {
    name: string;
    value: string;
}

export interface CrudHeadersConfig  extends  CrudMethodsInterface{
    createOne?: HeaderInterface;
    updateOne?: HeaderInterface;
    findAll?: HeaderInterface;
    deleteOne?: HeaderInterface;
    findOneById?: HeaderInterface;
}