import {ControllerCrudMehods, PrincipalService} from '../../..';
import {DeepPartial, ObjectLiteral} from 'typeorm';

export abstract class AbstractController<T = any> implements ControllerCrudMehods<T> {

    protected constructor(
        readonly _service: PrincipalService<T>,
    ) {
    }

    createMany(newRecords: DeepPartial<T>[]
    ): any {
    }

    createOne(newRecord: DeepPartial<T>): any {
    }

    deleteOne(id: number): any {
    }

    findAll(searchCriteria: ObjectLiteral): any {
    }

    findOneById(id: number): any {
    }

    updateOne(recordToUpdate: DeepPartial<T>, id: number): any {
    }
}
