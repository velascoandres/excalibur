import {IsEmpty} from 'class-validator';

export class PrincipalDto {
    @IsEmpty()
    id: number | undefined;
    @IsEmpty()
    creaatedAt: string = '';
    @IsEmpty()
    updatedAt: string = '';
    constructor() {
    }
}