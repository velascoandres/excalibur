import {IsEmpty, IsNotEmpty} from 'class-validator';
import {ObjectID} from 'typeorm';

export class PrincipalMongoUpdateDto {
    @IsNotEmpty()
    id: ObjectID | undefined;
    @IsEmpty()
    updatedAt: string = '';
    constructor() {
    }
}