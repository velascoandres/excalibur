import { PrincipalCrudController } from '../../..';
import { Observable } from 'rxjs';
import { ExcaliburAuth } from '../../interfaces/excalibur.auth';

export abstract class PrincipalAuthCrudValidation implements ExcaliburAuth {
    // For especific controller method implement an auth or security method
    // TODO implement auth strategy
    abstract createOneAuht(
        req: any,
        res: any,
        controller: PrincipalCrudController,
    ): Observable<boolean>;
    // TODO implement auth strategy
    abstract updateOneAuht(
        req: any,
        res: any,
        controller: PrincipalCrudController,
    ): Observable<boolean>;
    // TODO implement auth strategy
    abstract deleteOneAuth(
        req: any,
        res: any,
        controller: PrincipalCrudController,
    ): Observable<boolean>;
    // TODO implement auth strategy
    abstract findAllAuth(
        req: any,
        res: any,
        controller: PrincipalCrudController,
    ): Observable<boolean>;
    // TODO implement auth strategy
    abstract findOneAuht(
        req: any,
        res: any,
        controller: PrincipalCrudController,
    ): Observable<boolean>;
    // TODO implement auth strategy
    abstract findOneByIdAuht(
        req: any,
        res: any,
        controller: PrincipalCrudController,
    ): Observable<boolean>;
    // TODO implement auth strategy
    abstract createManyAuth(
        req: any,
        res: any,
        controller: PrincipalCrudController,
    ): Observable<boolean>;
    // TODO implement auth strategy
    abstract updateManyAuth(
        req: any,
        res: any,
        controller: PrincipalCrudController,
    ): Observable<boolean>;
    // TODO implement auth strategy
    abstract deleteManyAuth(
        req: any,
        res: any,
        controller: PrincipalCrudController,
    ): Observable<boolean>;
    // TODO implement auth strategy
    abstract countAuth(
        req: any,
        res: any,
        controller: PrincipalCrudController,
    ): Observable<boolean>;

}
