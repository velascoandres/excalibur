"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ControladorPrincipal = void 0;
const common_1 = require("@nestjs/common");
const class_validator_1 = require("class-validator");
require("reflect-metadata");
require("es6-shim");
const class_transformer_1 = require("class-transformer");
const principal_auth_crud_generico_1 = require("./principal.auth.crud.generico");
const generar_query_1 = require("../funciones/busqueda/busqueda-simple/generar-query");
let ControladorPrincipal = (() => {
    class ControladorPrincipal {
        constructor(_principalService, _authSecurityCrud = new principal_auth_crud_generico_1.PrincipalAuthCrudGenerico()) {
            this._principalService = _principalService;
            this._authSecurityCrud = _authSecurityCrud;
        }
        async createOne(nuevo, req, response) {
            const puedeRealizarAccion = this._authSecurityCrud.createOneAuht(req, response, this);
            if (puedeRealizarAccion) {
                const entidadoDto = class_transformer_1.plainToClass(this.nombreClaseDtoCrear, nuevo);
                const erroresValidacion = await class_validator_1.validate(entidadoDto);
                if (erroresValidacion.length > 0) {
                    throw new common_1.BadRequestException(erroresValidacion);
                }
                else {
                    try {
                        const nuevoRegistro = await this._principalService.createOne(nuevo);
                        return nuevoRegistro;
                    }
                    catch (error) {
                        console.error({
                            error,
                            mensaje: 'Error on create',
                            data: { registro: nuevo },
                        });
                        throw new common_1.BadRequestException(error);
                    }
                }
            }
            else {
                throw new common_1.UnauthorizedException('Not access granted');
            }
        }
        async updateOne(datosActualizar, id, req, response) {
            const puedeRealizarAccion = this._authSecurityCrud.updateOneAuht(req, response, this);
            if (puedeRealizarAccion) {
                const idValido = !isNaN(Number(id));
                if (idValido) {
                    const entidadoDto = class_transformer_1.plainToClass(this.nombreClaseDtoEditar, datosActualizar);
                    const erroresValidacion = await class_validator_1.validate(entidadoDto);
                    if (erroresValidacion.length > 0) {
                        throw new common_1.BadRequestException(erroresValidacion);
                    }
                    else {
                        try {
                            const registroActualizadoActualizado = await this._principalService.updateOne(Number(id), datosActualizar);
                            return {
                                data: registroActualizadoActualizado,
                            };
                        }
                        catch (error) {
                            console.error({
                                error,
                                mensaje: 'Error al actualizar',
                                data: { id, datosActualizar },
                            });
                            throw new common_1.InternalServerErrorException(error);
                        }
                    }
                }
                else {
                    throw new common_1.BadRequestException('invalid id');
                }
            }
            else {
                throw new common_1.UnauthorizedException('Not access granted');
            }
        }
        async deleteOne(id, req, response) {
            const puedeRealizarAccion = this._authSecurityCrud.deleteOneAuth(req, response, this);
            if (puedeRealizarAccion) {
                const idValido = !isNaN(Number(id));
                if (idValido) {
                    try {
                        const registroBorrado = await this._principalService.deleteOne(Number(id));
                        return {
                            data: registroBorrado,
                            error: false,
                            statusCode: common_1.HttpStatus.ACCEPTED,
                        };
                    }
                    catch (error) {
                        console.error({
                            error,
                            mensaje: 'Error on delete',
                            data: { id },
                        });
                        throw new common_1.InternalServerErrorException(error);
                    }
                }
                else {
                    throw new common_1.BadRequestException('invalid id');
                }
            }
            else {
                throw new common_1.UnauthorizedException('Not access granted');
            }
        }
        async findOneById(id, req, response) {
            const puedeRealizarAccion = this._authSecurityCrud.findOneByIdAuht(req, response, this);
            if (puedeRealizarAccion) {
                const idValido = !isNaN(Number(id));
                if (idValido) {
                    try {
                        const registrosBuscados = await this._principalService.findOneById(Number(id));
                        return registrosBuscados;
                    }
                    catch (error) {
                        console.error({
                            error,
                            mensaje: 'Error on fetch results',
                            data: { id },
                        });
                        throw new common_1.InternalServerErrorException(error);
                    }
                }
                else {
                    throw new common_1.BadRequestException('invalid id');
                }
            }
            else {
                throw new common_1.UnauthorizedException('Not access granted');
            }
        }
        async findAll(criteriosBusqueda, req, response) {
            console.log(req, response);
            const puedeRealizarAccion = this._authSecurityCrud.findAllAuth(req, response, this);
            console.log(puedeRealizarAccion);
            if (puedeRealizarAccion) {
                try {
                    const query = generar_query_1.generarQuery(criteriosBusqueda);
                    const resultado = await this._principalService.findAll(query);
                    response.status('200').send(resultado);
                }
                catch (error) {
                    console.error({
                        error,
                        mensaje: 'Error on fetch results',
                        data: criteriosBusqueda,
                    });
                    throw new common_1.InternalServerErrorException(error);
                }
            }
            else {
                throw new common_1.UnauthorizedException('Not access granted');
            }
        }
    }
    __decorate([
        common_1.Post(),
        __param(0, common_1.Body()),
        __param(1, common_1.Request()),
        __param(2, common_1.Response()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object, Object]),
        __metadata("design:returntype", Promise)
    ], ControladorPrincipal.prototype, "createOne", null);
    __decorate([
        common_1.Put(':id'),
        __param(0, common_1.Body()),
        __param(1, common_1.Param('id')),
        __param(2, common_1.Request()),
        __param(3, common_1.Response()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Number, Object, Object]),
        __metadata("design:returntype", Promise)
    ], ControladorPrincipal.prototype, "updateOne", null);
    __decorate([
        common_1.Delete(':id'),
        __param(0, common_1.Param('id')),
        __param(1, common_1.Request()),
        __param(2, common_1.Response()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Number, Object, Object]),
        __metadata("design:returntype", Promise)
    ], ControladorPrincipal.prototype, "deleteOne", null);
    __decorate([
        common_1.Get(':id'),
        __param(0, common_1.Param('id')),
        __param(1, common_1.Request()),
        __param(2, common_1.Response()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Number, Object, Object]),
        __metadata("design:returntype", Promise)
    ], ControladorPrincipal.prototype, "findOneById", null);
    __decorate([
        common_1.Get(),
        __param(0, common_1.Query()),
        __param(1, common_1.Request()),
        __param(2, common_1.Response()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object, Object]),
        __metadata("design:returntype", Promise)
    ], ControladorPrincipal.prototype, "findAll", null);
    return ControladorPrincipal;
})();
exports.ControladorPrincipal = ControladorPrincipal;
//# sourceMappingURL=controlador.principal.js.map