import { PrincipalAuthCrudValidation } from './principal.abstract.auth.crud';
import { PrincipalCrudController } from '../../..';
import { Observable, of } from 'rxjs';

export class AuthCrudGeneric extends PrincipalAuthCrudValidation {
    createManyAuth(req: any, res: any, controller: PrincipalCrudController): Observable<boolean> {
        return of(true);
    }
    updateManyAuth(req: any, res: any, controller: PrincipalCrudController): Observable<boolean> {
        return of(true);
    }
    deleteManyAuth(req: any, res: any, controller: PrincipalCrudController): Observable<boolean> {
        return of(true);
    }
    countAuth(req: any, res: any, controller: PrincipalCrudController): Observable<boolean> {
        return of(true);
    }
    createOneAuht(req: any, res: any, controller: PrincipalCrudController): Observable<boolean> {
        return of(true);
    }

    deleteOneAuth(req: any, res: any, controller: PrincipalCrudController): Observable<boolean> {
        return of(true);
    }

    findAllAuth(req: any, res: any, controller: PrincipalCrudController): Observable<boolean> {
        return of(true);
    }

    findOneAuht(req: any, res: any, controller: PrincipalCrudController): Observable<boolean> {
        return of(true);
    }

    findOneByIdAuht(req: any, res: any, controller: PrincipalCrudController): Observable<boolean> {
        return of(true);
    }

    updateOneAuht(req: any, res: any, controller: PrincipalCrudController): Observable<boolean> {
        return of(true);
    }

}
