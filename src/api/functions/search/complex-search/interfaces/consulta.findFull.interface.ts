import {CuerpoConsultaFindFull} from './cuerpo.consulta.findFull';
import {OrderByInterface} from './orderBy.interface';

export interface ConsultaFindFullInterface {
    where: { [key: string]: CuerpoConsultaFindFull | any };
    skip?: number;
    take?: number;
    orderBy?: OrderByInterface;
}