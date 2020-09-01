import {IsEmpty} from 'class-validator';

export class BaseDTO {
    @IsEmpty()
    id: number | undefined;
    @IsEmpty()
    creaatedAt: string | undefined;
    @IsEmpty()
    updatedAt: string | undefined;
    constructor() {
    }
}
