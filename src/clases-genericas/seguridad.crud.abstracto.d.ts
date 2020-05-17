import { ControladorPrincipal } from './controlador.principal';
export declare abstract class PrincipalAuthCrudValidation<Entidad> {
    abstract createOneAuht(req: any, res: any, controller: ControladorPrincipal<Entidad, any, any>): boolean;
    abstract updateOneAuht(req: any, res: any, controller: ControladorPrincipal<Entidad, any, any>): boolean;
    abstract deleteOneAuth(req: any, res: any, controller: ControladorPrincipal<Entidad, any, any>): boolean;
    abstract findAllAuth(req: any, res: any, controller: ControladorPrincipal<Entidad, any, any>): boolean;
    abstract findOneAuht(req: any, res: any, controller: ControladorPrincipal<Entidad, any, any>): boolean;
    abstract findOneByIdAuht(req: any, res: any, controller: ControladorPrincipal<Entidad, any, any>): boolean;
}
