"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrincipalAuthCrudGenerico = void 0;
const seguridad_crud_abstracto_1 = require("./seguridad.crud.abstracto");
class PrincipalAuthCrudGenerico extends seguridad_crud_abstracto_1.PrincipalAuthCrudValidation {
    createOneAuht(req, res, controller) {
        return true;
    }
    deleteOneAuth(req, res, controller) {
        return true;
    }
    findAllAuth(req, res, controller) {
        return true;
    }
    findOneAuht(req, res, controller) {
        return true;
    }
    findOneByIdAuht(req, res, controller) {
        return true;
    }
    updateOneAuht(req, res, controller) {
        return true;
    }
}
exports.PrincipalAuthCrudGenerico = PrincipalAuthCrudGenerico;
//# sourceMappingURL=principal.auth.crud.generico.js.map