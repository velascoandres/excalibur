import {PrincipalAuthCrudValidation} from './principal.abstract.auth.crud';
import {PrincipalController} from '../controllers/principal.controller';

export class AuthCrudGenerico extends PrincipalAuthCrudValidation{
    createOneAuht(req: any, res: any, controller: PrincipalController): boolean {
        return true;
    }

    deleteOneAuth(req: any, res: any, controller: PrincipalController): boolean {
        return true;
    }

    findAllAuth(req: any, res: any, controller: PrincipalController): boolean {
        return true;
    }

    findOneAuht(req: any, res: any, controller: PrincipalController): boolean {
        return true;
    }

    findOneByIdAuht(req: any, res: any, controller: PrincipalController): boolean {
        return true;
    }

    updateOneAuht(req: any, res: any, controller: PrincipalController): boolean {
        return true;
    }

}