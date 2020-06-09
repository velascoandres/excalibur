import {ApiProperty} from '@nestjs/swagger';
import {PrincipalEntity} from '../schemas/principal.entity';

export class GenericFindResponse {
    @ApiProperty({ type: [PrincipalEntity], description: 'data fetched by page' })
    data: [PrincipalEntity] | undefined;
    @ApiProperty({ type: Number, description: 'total of records' })
    total: number | undefined;
}