import {DtoConfigInterface} from '../../..';
import {PrincipalAuthCrudValidation, ApiController, BaseDTO, AbstractMongoService} from '../../..';
import {AuthCrudGeneric} from '../auth/auth.crud.generic';


export abstract class ApiMongoController<T>  extends  ApiController<T>{

    protected constructor(
        private readonly _mongoService: AbstractMongoService<T>,
        private readonly _mongoDtoConfig: DtoConfigInterface = {createDtoType: BaseDTO, updateDtoType: BaseDTO},
        private readonly _mongoAuthSecurityCrud: PrincipalAuthCrudValidation = new AuthCrudGeneric(),
    ) {
        super(
            _mongoService,
            _mongoDtoConfig,
            _mongoAuthSecurityCrud,
        );
    }
}