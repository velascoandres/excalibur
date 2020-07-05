import {ApiProperty} from '@nestjs/swagger';
import {AbstractEntity} from '../schemas/abstract-entity';

export class GenericFindResponse {
    @ApiProperty({ type: [AbstractEntity], description: 'data fetched by page' })
    data: [Partial<AbstractEntity>] | undefined;
    @ApiProperty({ type: Number, description: 'total of records' })
    total: number | undefined;
}