import {IsEmpty, IsNumber} from 'class-validator';

export class DtoPrincipal {
    @IsEmpty()
    id: number = 0;
    @IsEmpty()
    creaatedAt: string = '';
    @IsEmpty()
    updatedAt: string = '';
    constructor() {
    }
}