import {FindFullQueryBody} from './find-full-query-body';
import {OrderByInterface} from './orderBy.interface';
// FindFullQuery
export interface FindFullQuery {
    where: { [key: string]: FindFullQueryBody | any };
    skip?: number;
    take?: number;
    orderBy?: OrderByInterface;
}