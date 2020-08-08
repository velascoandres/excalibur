import {ApiController} from '../..';
import {Observable} from 'rxjs';

export interface ExcaliburAuth {
    createOneAuht(
        req: any,
        res: any,
        controller: ApiController
    ): Observable<boolean>;
    updateOneAuht(
        req: any,
        res: any,
        controller: ApiController
    ): Observable<boolean>;
    deleteOneAuth(
        req: any,
        res: any,
        controller: ApiController
    ): Observable<boolean>;
    findAllAuth(
        req: any,
        res: any,
        controller: ApiController
    ): Observable<boolean>;
    findOneAuht(
        req: any,
        res: any,
        controller: ApiController
    ): Observable<boolean>;
    findOneByIdAuht(
        req: any,
        res: any,
        controller: ApiController
    ): Observable<boolean>;
}
