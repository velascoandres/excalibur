import {IsEmpty} from 'class-validator';

export class BaseDTO {
    @IsEmpty()
    id: number | undefined;
    @IsEmpty()
    createdAt: string | undefined;
    @IsEmpty()
    updatedAt: string | undefined;
    constructor() {
    }
}
