"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var cargar_datos_prueba_1 = require("./funciones/archivos/cargar-datos-prueba");
Object.defineProperty(exports, "crearDatos", { enumerable: true, get: function () { return cargar_datos_prueba_1.crearDatos; } });
var borrar_archivos_1 = require("./funciones/archivos/borrar-archivos");
Object.defineProperty(exports, "borrarArhicvo", { enumerable: true, get: function () { return borrar_archivos_1.borrarArhicvo; } });
var controlador_principal_1 = require("./clases-genericas/controlador.principal");
Object.defineProperty(exports, "ControladorPrincipal", { enumerable: true, get: function () { return controlador_principal_1.ControladorPrincipal; } });
var principalService_1 = require("./clases-genericas/principalService");
Object.defineProperty(exports, "PrincipalService", { enumerable: true, get: function () { return principalService_1.PrincipalService; } });
var entidad_principal_1 = require("./clases-genericas/entidad.principal");
Object.defineProperty(exports, "EntidadPrincipal", { enumerable: true, get: function () { return entidad_principal_1.EntidadPrincipal; } });
var seguridad_crud_abstracto_1 = require("./clases-genericas/seguridad.crud.abstracto");
Object.defineProperty(exports, "PrincipalAuthCrudValidation", { enumerable: true, get: function () { return seguridad_crud_abstracto_1.PrincipalAuthCrudValidation; } });
var dto_principal_1 = require("./clases-genericas/dto.principal");
Object.defineProperty(exports, "DtoPrincipal", { enumerable: true, get: function () { return dto_principal_1.DtoPrincipal; } });
//# sourceMappingURL=index.js.map