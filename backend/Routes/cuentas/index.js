const {Router} = require("express");
const router = Router();

const {crearCuenta, obtenerCuentasHijas, obtenerGrupos,
    obtenerCuentas, obtenerCuenta, exportarCuentasExcel,
    actualizarCuenta
} = require("../../Controllers/cuentaControlller");
router.post("/cuentas", crearCuenta);
router.put("/cuentas", actualizarCuenta);
router.get("/cuentas", obtenerCuentas);
router.get("/cuenta/:id", obtenerCuenta);
router.get("/cuentas/grupos", obtenerGrupos);
router.get("/cuentas/hijas/:id", obtenerCuentasHijas);
router.get("/cuentas/exportar", exportarCuentasExcel);


module.exports = router;    