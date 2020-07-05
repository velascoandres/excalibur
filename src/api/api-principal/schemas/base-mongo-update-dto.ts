import {IsEmpty, IsNotEmpty} from 'class-validator';
import {ObjectID} from 'typeorm';

export class BaseMongoUpdateDto {
    @IsNotEmpty()
    id: ObjectID | undefined;
    @IsEmpty()
    updatedAt: string = '';
    constructor() {
    }
}