import {ObjectLiteral} from 'typeorm';

export interface PureRelationInterface {
    relation: string;
    alias: string;
    condition?: string;
    parameters?: ObjectLiteral;
}