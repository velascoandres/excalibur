import { PrincipalCrudController } from '../..';
import { Observable } from 'rxjs';

export interface ExcaliburAuth {
    createOneAuht(
        req: any,
        res: any,
        controller: PrincipalCrudController
    ): Observable<boolean>;
    updateOneAuht(
        req: any,
        res: any,
        controller: PrincipalCrudController
    ): Observable<boolean>;
    deleteOneAuth(
        req: any,
        res: any,
        controller: PrincipalCrudController
    ): Observable<boolean>;
    findAllAuth(
        req: any,
        res: any,
        controller: PrincipalCrudController
    ): Observable<boolean>;
    findOneAuht(
        req: any,
        res: any,
        controller: PrincipalCrudController
    ): Observable<boolean>;
    findOneByIdAuht(
        req: any,
        res: any,
        controller: PrincipalCrudController
    ): Observable<boolean>;

    createManyAuth(
        req: any,
        res: any,
        controller: PrincipalCrudController
    ): Observable<boolean>;

    updateManyAuth(
        req: any,
        res: any,
        controller: PrincipalCrudController
    ): Observable<boolean>;

    deleteManyAuth(
        req: any,
        res: any,
        controller: PrincipalCrudController
    ): Observable<boolean>;

    countAuth(
        req: any,
        res: any,
        controller: PrincipalCrudController
    ): Observable<boolean>;
}
