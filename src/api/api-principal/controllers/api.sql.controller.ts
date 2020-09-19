import { DtoConfig } from '../../..';
import { PrincipalAuthCrudValidation } from '../../..';
import { AuthCrudGeneric } from '../auth/auth.crud.generic';
import { BaseDTO } from '../../..';
import { DtoConfigInterface } from '../../..';
import { ExcaliburAuth } from '../../..';
import { ApiController } from './api.controller';
import { AbstractSQLService } from '../services/abstract-sql.service';

export abstract class ApiSqlController<Entidad = any> extends ApiController<Entidad> {

    protected constructor(
        private readonly principalService: AbstractSQLService<Entidad>,
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

