const {Router} = require("express");
const router = Router();

const {crearCuenta, obtenerCuentasHijas, obtenerGrupos,
    obtenerCuentas
} = require("../Controllers/cuentaControlller");
router.post("/cuentas", crearCuenta);
router.get("/cuentas", obtenerCuentas);
router.get("/cuentas/grupos", obtenerGrupos);
router.post("/cuentas/hijas", obtenerCuentasHijas);

module.exports = router;    