import {IsEmpty, IsNotEmpty} from 'class-validator';
import {ObjectID} from 'typeorm';

export class BaseMongoDTO {
    @IsNotEmpty()
    id: ObjectID | undefined;
    @IsEmpty()
    updatedAt: string = '';
    constructor() {
    }
}