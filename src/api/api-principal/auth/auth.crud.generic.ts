import {PrincipalAuthCrudValidation} from './principal.abstract.auth.crud';
import {ApiController} from '../../..';
import {Observable, of} from 'rxjs';

export class AuthCrudGeneric extends PrincipalAuthCrudValidation {
    createOneAuht(req: any, res: any, controller: ApiController): Observable<boolean> {
        return of(true);
    }

    deleteOneAuth(req: any, res: any, controller: ApiController): Observable<boolean> {
        return of(true);
    }

    findAllAuth(req: any, res: any, controller: ApiController): Observable<boolean> {
        return of(true);
    }

    findOneAuht(req: any, res: any, controller: ApiController): Observable<boolean> {
        return of(true);
    }

    findOneByIdAuht(req: any, res: any, controller: ApiController): Observable<boolean> {
        return of(true);
    }

    updateOneAuht(req: any, res: any, controller: ApiController): Observable<boolean> {
        return of(true);
    }

}
