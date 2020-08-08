import {ApiController} from '../../..';
import {Observable} from 'rxjs';
import {ExcaliburAuthInterface} from '../../interfaces/excalibur-auth.interface';

export abstract class PrincipalAuthCrudValidation implements ExcaliburAuthInterface{
    // For especific controller method implement an auth or security method
    // TODO implement auth strategy
    abstract createOneAuht(
        req: any,
        res: any,
        controller: ApiController
    ): Observable<boolean>;
    // TODO implement auth strategy
    abstract updateOneAuht(
        req: any,
        res: any,
        controller: ApiController
    ): Observable<boolean>;
    // TODO implement auth strategy
    abstract deleteOneAuth(
        req: any,
        res: any,
        controller: ApiController
    ): Observable<boolean>;
    // TODO implement auth strategy
    abstract findAllAuth(
        req: any,
        res: any,
        controller: ApiController
    ): Observable<boolean>;
    // TODO implement auth strategy
    abstract findOneAuht(
        req: any,
        res: any,
        controller: ApiController
    ): Observable<boolean>;
    // TODO implement auth strategy
    abstract findOneByIdAuht(
        req: any,
        res: any,
        controller: ApiController
    ): Observable<boolean>;
}
