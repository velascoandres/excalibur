import {ControllerCrudMehods, PrincipalService} from '../../..';
import {DeepPartial, ObjectLiteral} from 'typeorm';

export abstract class AbstractController<T = any> implements ControllerCrudMehods<T> {

    protected constructor(
        readonly _service: PrincipalService<T>,
    ) {
    }

    createMany(newRecords: DeepPartial<T>[], ...args: any[]): any {
    }

    createOne(newRecord: DeepPartial<T>, ...args: any[]): any {
    }

    deleteOne(id: number, ...args: any[]): any {
    }

    findAll(searchCriteria: ObjectLiteral, ...args: any[]): any {
    }

    findOneById(id: number, ...args: any[]): any {
    }

    updateOne(recordToUpdate: DeepPartial<T>, id: number, ...args: any[]): any {
    }
}
