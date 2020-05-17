import { PrincipalAuthCrudValidation } from './seguridad.crud.abstracto';
import { ControladorPrincipal } from './controlador.principal';
export declare class PrincipalAuthCrudGenerico extends PrincipalAuthCrudValidation<any> {
    createOneAuht(req: any, res: any, controller: ControladorPrincipal<any, any, any>): boolean;
    deleteOneAuth(req: any, res: any, controller: ControladorPrincipal<any, any, any>): boolean;
    findAllAuth(req: any, res: any, controller: ControladorPrincipal<any, any, any>): boolean;
    findOneAuht(req: any, res: any, controller: ControladorPrincipal<any, any, any>): boolean;
    findOneByIdAuht(req: any, res: any, controller: ControladorPrincipal<any, any, any>): boolean;
    updateOneAuht(req: any, res: any, controller: ControladorPrincipal<any, any, any>): boolean;
}
