import {IsMongoId, IsNotEmpty} from 'class-validator';

export class DefaultMongoParamDto {
    @IsNotEmpty()
    @IsMongoId()
    id: string | undefined;
}
