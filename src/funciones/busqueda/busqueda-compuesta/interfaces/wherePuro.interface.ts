import {ObjectLiteral} from 'typeorm';

export interface WherePuroInterface {
    where: string;
    parametros: ObjectLiteral;
    conjuncion?: string;
}