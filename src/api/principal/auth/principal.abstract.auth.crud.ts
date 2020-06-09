import {PrincipalController} from '../controllers/principal.controller';

export abstract class PrincipalAuthCrudValidation{
    // For especific controller method implement an auth or security method
    // TODO implement auth strategy
    abstract createOneAuht(
        req: any,
        res: any,
        controller: PrincipalController
    ): boolean;
    // TODO implement auth strategy
    abstract updateOneAuht(
        req: any,
        res: any,
        controller: PrincipalController
    ): boolean;
    // TODO implement auth strategy
    abstract deleteOneAuth(
        req: any,
        res: any,
        controller: PrincipalController
    ): boolean;
    // TODO implement auth strategy
    abstract findAllAuth(
        req: any,
        res: any,
        controller: PrincipalController
    ): boolean;
    // TODO implement auth strategy
    abstract findOneAuht(
        req: any,
        res: any,
        controller: PrincipalController
    ): boolean;
    // TODO implement auth strategy
    abstract findOneByIdAuht(
        req: any,
        res: any,
        controller: PrincipalController
    ): boolean;
}