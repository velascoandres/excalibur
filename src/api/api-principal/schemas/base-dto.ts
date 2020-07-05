import {IsEmpty} from 'class-validator';

export class BaseDTO {
    @IsEmpty()
    id: number | undefined;
    @IsEmpty()
    creaatedAt: string = '';
    @IsEmpty()
    updatedAt: string = '';
    constructor() {
    }
}