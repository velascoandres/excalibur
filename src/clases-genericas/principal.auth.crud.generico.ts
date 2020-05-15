import {PrincipalAuthCrudValidation} from './seguridad.crud.abstracto';
import {ControladorPrincipal} from './controlador.principal';

export class PrincipalAuthCrudGenerico extends PrincipalAuthCrudValidation<any>{
    createOneAuht(req: any, res: any, controller: ControladorPrincipal<any, any, any>): boolean {
        return true;
    }

    deleteOneAuth(req: any, res: any, controller: ControladorPrincipal<any, any, any>): boolean {
        return true;
    }

    findAllAuth(req: any, res: any, controller: ControladorPrincipal<any, any, any>): boolean {
        return true;
    }

    findOneAuht(req: any, res: any, controller: ControladorPrincipal<any, any, any>): boolean {
        return true;
    }

    findOneByIdAuht(req: any, res: any, controller: ControladorPrincipal<any, any, any>): boolean {
        return true;
    }

    updateOneAuht(req: any, res: any, controller: ControladorPrincipal<any, any, any>): boolean {
        return true;
    }

}