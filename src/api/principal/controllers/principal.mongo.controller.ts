import {DtoConfigInterface} from '../../interfaces/controllers.interfaces';
import {PrincipalAuthCrudValidation, PrincipalController, PrincipalDto, PrincipalMongoService} from '../../..';
import {AuthCrudGenerico} from '../auth/auth.crud.generico';


export abstract class PrincipalMongoController<T>  extends  PrincipalController<T>{

    protected constructor(
        private readonly _mongoService: PrincipalMongoService<T>,
        private readonly _mongoDtoConfig: DtoConfigInterface = {createDtoType: PrincipalDto, updateDtoType: PrincipalDto},
        private readonly _mongoAuthSecurityCrud: PrincipalAuthCrudValidation = new AuthCrudGenerico(),
    ) {
        super(
            _mongoService,
            _mongoDtoConfig,
            _mongoAuthSecurityCrud,
        );
    }
}