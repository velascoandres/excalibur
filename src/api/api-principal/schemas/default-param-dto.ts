import {IsNotEmpty, IsNumber} from 'class-validator';

export class DefaultParamDto {
    @IsNotEmpty()
    @IsNumber()
    id: number | undefined;
}
