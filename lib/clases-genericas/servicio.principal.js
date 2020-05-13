"use strict";
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
exports.ServicioPrincipal = void 0;
class ServicioPrincipal {
    constructor(_filaRepository) {
        this._filaRepository = _filaRepository;
    }
    crear(fila) {
        return __awaiter(this, void 0, void 0, function* () {
            const filaInstanciado = yield this._filaRepository.create(fila);
            const filaCreado = yield this._filaRepository.save(filaInstanciado); // Conectarse a la db
            const filaConRelaciones = yield this._filaRepository.findOne(filaCreado.id);
            return filaConRelaciones;
        });
    }
    editar(id, fila) {
        return __awaiter(this, void 0, void 0, function* () {
            const registroActualizado = yield this._filaRepository.update(id, fila);
            const registro = yield this._filaRepository.findOne(id);
            return registro;
        });
    }
    borrar(idRegistro) {
        return __awaiter(this, void 0, void 0, function* () {
            // CREA UNA INSTANCIA DE LA ENTIDAD
            const registroEliminar = yield this.buscarPorId(idRegistro);
            if (registroEliminar) {
                return this._filaRepository.remove(registroEliminar);
            }
            else {
                return 'No existe el registro';
            }
        });
    }
    listar(parametros) {
        return __awaiter(this, void 0, void 0, function* () {
            const registros = yield this._filaRepository.findAndCount(parametros);
            return registros;
        });
    }
    buscarUnoPorParemtros(parametros) {
        return __awaiter(this, void 0, void 0, function* () {
            const registros = yield this._filaRepository.findOne(parametros);
            return registros;
        });
    }
    buscarPorId(id) {
        return this._filaRepository.findOne(id);
    }
}
exports.ServicioPrincipal = ServicioPrincipal;
