import { BaseDTO, BaseMongoDTO } from '../..';
import {DeepPartial, ObjectLiteral} from 'typeorm';


export interface DtoConfig {
    createDtoType: any;
    updateDtoType: any;
    idParamDtoType?: any;
}

export interface DtoConfigInterface extends DtoConfig {
    createDtoType: typeof BaseDTO | (new () => any);
    updateDtoType: typeof BaseDTO | (new () => any);
}

export interface DtoMongoConfigInterface extends DtoConfig {
    createDtoType: typeof BaseMongoDTO | (new () => any);
    updateDtoType: typeof BaseMongoDTO | (new () => any);
}

export interface ControllerCrudMethods<T> {

    createOne(newRecord: DeepPartial<T> | Partial<T>, req: any, response: any, ...args: any[]): any;

    updateOne(recordToUpdate: DeepPartial<T> | Partial<T>, id: number, req: any, response: any, ...args: any[]): any;

    deleteOne(id: number, req: any, response: any, ...args: any[]): any;

    findAll(searchCriteria: {[k in string]: any}, req: any, response: any, ...args: any[]): any;

    findOneById(id: number, req: any, response: any, ...args: any[]): any;

    createMany(newRecords: DeepPartial<T>[] | Partial<T>[], req: any, response: any, ...args: any[]): any;

}



