import { DtoConfig } from '../../..';
import { PrincipalAuthCrudValidation } from '../../..';
import { AuthCrudGeneric } from '../auth/auth.crud.generic';
import { BaseDTO } from '../../..';
import { DtoConfigInterface } from '../../..';
import { ExcaliburAuth } from '../../..';
import { PrincipalCrudController } from './principal-crud.controller';
import { AbstractService } from '../services/abstract.service';

export abstract class ApiController<Entidad = any> extends PrincipalCrudController<Entidad> {

    protected constructor(
        private readonly principalService: AbstractService<Entidad>,
        private readonly dtoConfig: DtoConfigInterface | DtoConfig = { createDtoType: BaseDTO, updateDtoType: BaseDTO },
        private readonly authSecurityCrud: PrincipalAuthCrudValidation | (Function & ExcaliburAuth) = new AuthCrudGeneric(),
    ) {
        super(
            principalService,
            dtoConfig,
            authSecurityCrud,
        );
    }
    protected validateId(id: any): boolean {
        return !isNaN(Number(id));
    }
}

