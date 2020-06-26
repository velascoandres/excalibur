import {PrincipalAuthCrudValidation} from './principal.abstract.auth.crud';
import {ApiController} from '../../..';

export class AuthCrudGeneric extends PrincipalAuthCrudValidation{
    createOneAuht(req: any, res: any, controller: ApiController): boolean {
        return true;
    }

    deleteOneAuth(req: any, res: any, controller: ApiController): boolean {
        return true;
    }

    findAllAuth(req: any, res: any, controller: ApiController): boolean {
        return true;
    }

    findOneAuht(req: any, res: any, controller: ApiController): boolean {
        return true;
    }

    findOneByIdAuht(req: any, res: any, controller: ApiController): boolean {
        return true;
    }

    updateOneAuht(req: any, res: any, controller: ApiController): boolean {
        return true;
    }

}