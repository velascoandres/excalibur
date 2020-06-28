import {ObjectLiteral} from 'typeorm';

export interface PureWhereInterface {
    where: string;
    parameters: ObjectLiteral;
    conjunction?: string;
}