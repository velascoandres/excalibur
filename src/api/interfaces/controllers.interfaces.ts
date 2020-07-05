import {BaseDTO} from '../..';
import {DeepPartial, ObjectLiteral} from 'typeorm';


export interface DtoConfigInterface {
    createDtoType: typeof BaseDTO;
    updateDtoType: typeof BaseDTO;
}

export interface ControllerCrudMehods<T>   {

     createOne(newRecord: DeepPartial<T>, req: any, response: any): any;

     updateOne(recordToUpdate: DeepPartial<T>, id: number, req: any, response: any): any;

     deleteOne(id: number, req: any, response: any): any;

     findAll(searchCriteria: ObjectLiteral, req: any, response: any): any;

     findOneById(id: number, req: any, response: any): any;

}



