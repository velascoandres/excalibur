import {IsEmpty, IsNumber} from 'class-validator';

export class DtoPrincipal {
    @IsEmpty()
    id: number | undefined;
    @IsEmpty()
    creaatedAt: string = '';
    @IsEmpty()
    updatedAt: string = '';
    constructor() {
    }
}