import {IsNotEmpty, IsNumberString} from 'class-validator';

export class DefaultParamDto {
    @IsNotEmpty()
    @IsNumberString()
    id: any;
}
