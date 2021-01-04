import {ControllerCrudMethods, PrincipalService} from '../../..';
import {DeepPartial, ObjectLiteral} from 'typeorm';
import {Document} from 'mongoose';
import {AbstractMongooseService} from '../services/abstract-mongoose.service';

export abstract class AbstractController<T = any> implements ControllerCrudMethods<T> {

    protected constructor(
        readonly service: PrincipalService<T>,
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

    updateOne(...args: any[]): any {
    }
}


export abstract class AbstractMongooseController<T extends Document = any> implements ControllerCrudMethods<T> {

    protected constructor(
        readonly service: AbstractMongooseService<T>,
    ) {
    }

    createMany(newRecords: Partial<T>[], ...args: any[]): any {
    }

    createOne(newRecord: Partial<T>, ...args: any[]): any {
    }

    deleteOne(id: number, ...args: any[]): any {
    }

    findAll(searchCriteria: ObjectLiteral, ...args: any[]): any {
    }

    findOneById(id: number, ...args: any[]): any {
    }

    updateOne(...args: any[]): any {
    }
}