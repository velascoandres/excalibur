import {ObjectLiteral} from 'typeorm';

export interface RelacionPuraInterface {
    relacion: string;
    alias: string;
    condicion?: string;
    parametros?: ObjectLiteral;
}