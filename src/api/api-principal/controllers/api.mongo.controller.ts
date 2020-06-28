import {DtoConfigInterface} from '../../interfaces/controllers.interfaces';
import {PrincipalAuthCrudValidation, ApiController, PrincipalDto, PrincipalMongoService} from '../../..';
import {AuthCrudGeneric} from '../auth/auth.crud.generic';


export abstract class ApiMongoController<T>  extends  ApiController<T>{

    protected constructor(
        private readonly _mongoService: PrincipalMongoService<T>,
        private readonly _mongoDtoConfig: DtoConfigInterface = {createDtoType: PrincipalDto, updateDtoType: PrincipalDto},
        private readonly _mongoAuthSecurityCrud: PrincipalAuthCrudValidation = new AuthCrudGeneric(),
    ) {
        super(
            _mongoService,
            _mongoDtoConfig,
            _mongoAuthSecurityCrud,
        );
    }
}