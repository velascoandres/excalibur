"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrincipalService = void 0;
const common_1 = require("@nestjs/common");
class PrincipalService {
    constructor(_filaRepository) {
        this._filaRepository = _filaRepository;
    }
    async createOne(fila) {
        const filaInstanciado = await this._filaRepository.create(fila);
        const filaCreado = await this._filaRepository.save(filaInstanciado);
        return await this._filaRepository.findOne(filaCreado.id);
    }
    async updateOne(id, fila) {
        const registroActualizado = await this._filaRepository.update(id, fila);
        return await this._filaRepository.findOne(id);
    }
    async deleteOne(idRegistro) {
        const registroEliminar = await this.findOneById(idRegistro);
        if (registroEliminar) {
            return this._filaRepository.remove(registroEliminar);
        }
        else {
            throw new common_1.NotFoundException('No existe el registro');
        }
    }
    async findAll(parametros) {
        const estaVacio = parametros && Object.keys(parametros).length > 0;
        if (estaVacio) {
            return await this._filaRepository.findAndCount({ skip: 0, take: 10 });
        }
        else {
            return await this._filaRepository.findAndCount(parametros);
        }
    }
    async findOne(parametros) {
        return await this._filaRepository.findOne(parametros);
    }
    async findOneById(id) {
        return await this._filaRepository.findOne(id);
    }
}
exports.PrincipalService = PrincipalService;
//# sourceMappingURL=principalService.js.map