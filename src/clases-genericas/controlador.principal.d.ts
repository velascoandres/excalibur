import { PrincipalService } from './principalService';
import { RespuestaPrincipalInterface } from '../interfaces/respuesta.principal.interface';
import { UpdateResult } from 'typeorm';
import 'reflect-metadata';
import 'es6-shim';
import { PrincipalAuthCrudValidation } from './seguridad.crud.abstracto';
export declare abstract class ControladorPrincipal<Entidad, DtoCrear, DtoEditar> {
    private readonly _principalService;
    private readonly _authSecurityCrud;
    private nombreClaseDtoEditar;
    private nombreClaseDtoCrear;
    protected constructor(_principalService: PrincipalService<Entidad>, _authSecurityCrud?: PrincipalAuthCrudValidation<Entidad>);
    createOne(nuevo: DtoCrear, req: any, response: any): Promise<Entidad>;
    updateOne(datosActualizar: DtoEditar, id: number, req: any, response: any): Promise<RespuestaPrincipalInterface<Entidad | UpdateResult | any>>;
    deleteOne(id: number, req: any, response: any): Promise<RespuestaPrincipalInterface<Entidad>>;
    findOneById(id: number, req: any, response: any): Promise<Entidad>;
    findAll(criteriosBusqueda: any, req: any, response: any): Promise<void>;
}
