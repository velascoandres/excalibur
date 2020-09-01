import {IsEmpty} from 'class-validator';
import {ObjectID} from 'typeorm';

export class BaseMongoDTO {
    @IsEmpty()
    id: ObjectID | undefined;
    @IsEmpty()
    updatedAt: string | undefined;
    @IsEmpty()
    createdAt: string | undefined;
    constructor() {
    }
}
