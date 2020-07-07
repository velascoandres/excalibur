import {BaseMongoDTO, DtoConfig, DtoConfigInterface, DtoMongoConfigInterface} from '../../..';
import {PrincipalAuthCrudValidation, ApiController, BaseDTO, AbstractMongoService} from '../../..';
import {AuthCrudGeneric} from '../auth/auth.crud.generic';


export abstract class ApiMongoController<T>  extends  ApiController<T>{

    protected constructor(
        private readonly _mongoService: AbstractMongoService<T>,
        private readonly _mongoDtoConfig: DtoMongoConfigInterface  = {createDtoType: BaseMongoDTO, updateDtoType: BaseMongoDTO},
        private readonly _mongoAuthSecurityCrud: PrincipalAuthCrudValidation = new AuthCrudGeneric(),
    ) {
        super(
            _mongoService,
            _mongoDtoConfig,
            _mongoAuthSecurityCrud,
        );
    }
}