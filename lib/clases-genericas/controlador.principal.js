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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generarQuery = exports.convertirStringArreglo = exports.ControladorPrincipal = void 0;
const common_1 = require("@nestjs/common");
const class_validator_1 = require("class-validator");
const typeorm_1 = require("typeorm");
let ControladorPrincipal = /** @class */ (() => {
    class ControladorPrincipal {
        constructor(_principalService) {
            this._principalService = _principalService;
        }
        crear(nuevo) {
            return __awaiter(this, void 0, void 0, function* () {
                const entidadoDto = new this.nombreClaseDtoCrear(nuevo);
                const erroresValidacion = yield class_validator_1.validate(entidadoDto);
                if (erroresValidacion.length > 0) {
                    throw new common_1.BadRequestException(erroresValidacion);
                }
                else {
                    try {
                        const nuevoRegistro = yield this._principalService.crear(nuevo);
                        return nuevoRegistro;
                    }
                    catch (e) {
                        throw new common_1.BadRequestException(e);
                    }
                }
            });
        }
        editar(datosActualizar, id) {
            return __awaiter(this, void 0, void 0, function* () {
                const idValido = !isNaN(Number(id));
                if (idValido) {
                    const entidadoDto = new this.nombreClaseDtoEditar(datosActualizar);
                    const erroresValidacion = yield class_validator_1.validate(entidadoDto);
                    if (erroresValidacion.length > 0) {
                        throw new common_1.BadRequestException(erroresValidacion);
                    }
                    else {
                        try {
                            const registroActualizadoActualizado = yield this._principalService.editar(Number(id), datosActualizar);
                            return {
                                data: registroActualizadoActualizado,
                            };
                        }
                        catch (e) {
                            throw new common_1.InternalServerErrorException(e);
                        }
                    }
                }
                else {
                    throw new common_1.BadRequestException('id inválido!!');
                }
            });
        }
        eliminar(id) {
            return __awaiter(this, void 0, void 0, function* () {
                const idValido = !isNaN(Number(id));
                if (idValido) {
                    try {
                        const registroBorrado = yield this._principalService.borrar(Number(id));
                        return {
                            data: registroBorrado,
                            error: false,
                            statusCode: common_1.HttpStatus.ACCEPTED,
                        };
                    }
                    catch (e) {
                        throw new common_1.BadRequestException(e);
                    }
                }
                else {
                    throw new common_1.BadRequestException('id inválido!!');
                }
            });
        }
        buscarPorId(id) {
            return __awaiter(this, void 0, void 0, function* () {
                const idValido = !isNaN(Number(id));
                if (idValido) {
                    try {
                        const registrosBuscados = yield this._principalService.buscarPorId(Number(id));
                        return registrosBuscados;
                    }
                    catch (e) {
                        throw new common_1.BadRequestException(e);
                    }
                }
                else {
                    throw new common_1.BadRequestException('id inválido!!');
                }
            });
        }
        buscarTodos(criteriosBusqueda) {
            return __awaiter(this, void 0, void 0, function* () {
                const mandaParametrosBusqueda = criteriosBusqueda !== undefined;
                try {
                    let registros;
                    if (mandaParametrosBusqueda) {
                        const query = generarQuery(criteriosBusqueda);
                        console.log(query);
                        registros = yield this._principalService.listar(query);
                    }
                    else {
                        registros = yield this._principalService.listar({
                            order: { id: 'DESC' },
                        });
                    }
                    return [
                        registros[0],
                        registros[1],
                    ];
                }
                catch (e) {
                    throw new common_1.BadRequestException(e);
                }
            });
        }
    }
    __decorate([
        common_1.Post(),
        __param(0, common_1.Body()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", Promise)
    ], ControladorPrincipal.prototype, "crear", null);
    __decorate([
        common_1.Put(':id'),
        __param(0, common_1.Body()),
        __param(1, common_1.Param('id')),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Number]),
        __metadata("design:returntype", Promise)
    ], ControladorPrincipal.prototype, "editar", null);
    __decorate([
        common_1.Delete(':id'),
        __param(0, common_1.Param('id')),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Number]),
        __metadata("design:returntype", Promise)
    ], ControladorPrincipal.prototype, "eliminar", null);
    __decorate([
        common_1.Get(':id'),
        __param(0, common_1.Param('id')),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Number]),
        __metadata("design:returntype", Promise)
    ], ControladorPrincipal.prototype, "buscarPorId", null);
    __decorate([
        common_1.Get(),
        __param(0, common_1.Query()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", Promise)
    ], ControladorPrincipal.prototype, "buscarTodos", null);
    return ControladorPrincipal;
})();
exports.ControladorPrincipal = ControladorPrincipal;
function convertirStringArreglo(cadena) {
    const longitud = cadena.length;
    const posicionFinal = longitud - 1;
    const soloTexto = cadena.slice(1, posicionFinal);
    return soloTexto.split(',');
}
exports.convertirStringArreglo = convertirStringArreglo;
function generarQuery(parametro) {
    const llaves = Object.keys(parametro);
    const query = {
        order: { id: 'DESC' },
        skip: 0,
        take: 5,
    };
    llaves.forEach((llave) => {
        switch (llave) {
            case 'where':
                const parametrosWhere = JSON.parse(parametro[llave]); // {nombre: {like: 'abc'}}
                const valoresParametroWhere = Object.values(parametrosWhere); // [{'like':'abc'}, ...]
                const llavesParametroWhere = Object.keys(parametrosWhere); // ['nombre',...]
                valoresParametroWhere.forEach((valor, index) => {
                    if (typeof valor === 'object') {
                        const llaves = Object.keys(valor);
                        llaves.forEach(subLlave => {
                            if (subLlave === 'like') {
                                parametrosWhere[llavesParametroWhere[index]] = typeorm_1.Like(`%${valor.like}%`);
                            }
                        });
                    }
                });
                query.where = parametrosWhere;
                break;
            case 'relations':
                query.relations = convertirStringArreglo(parametro[llave]);
                break;
            case 'order':
                query.order = JSON.parse(parametro[llave]);
                break;
            case 'skip':
                query.skip = !isNaN(+parametro[llave]) ? +parametro[llave] : 0;
                break;
            case 'take':
                query.take = !isNaN(+parametro[llave]) ? +parametro[llave] : 0;
                break;
        }
    });
    return query;
}
exports.generarQuery = generarQuery;
