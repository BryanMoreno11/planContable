const ModuleSQL = require("../sequelize/models");

async function crearCuenta(req, res) {
  try {
    await ModuleSQL.Cuenta.create(req.body)
      .then((cuenta) => {
        return res.status(200).json({ message: "Cuenta creada correctamente" });
        a;
      })
      .catch((e) => {
        console.log(e);
        return res.status(404).json({ error: "Cuenta no encontrada" });
      });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error en el servidor", details: error.message });
  }
}

async function obtenerGrupos(req, res) {
  try {
    ModuleSQL.Cuenta.findAll({
      where: {
        cuenta_idpadre: null,
      },
      order: [["cuenta_codigonivel", "ASC"]],
    })
      .then((result) => {
        const grupos = result.map((grupo) => ({
          cuenta_id: grupo.cuenta_id,
          texto: `${grupo.cuenta_codigonivel} ${grupo.cuenta_descripcion}`,
        }));
        res.status(200).json(grupos);
      })
      .catch((e) => {
        console.log(e);
        return res.status(404).json({ error: "Cuentas no encontradas" });
      });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error en el servidor", details: error.message });
  }
}

async function obtenerCuentasHijas(req, res) {
  try {
    const { id } = req.params;
    await ModuleSQL.Cuenta.findAll({
      where: {
        cuenta_idpadre: id,
      },
      order: [["cuenta_codigonivel", "ASC"]],
    })
      .then((result) => {
        const cuentas = result.map((cuenta) => ({
          cuenta_id: cuenta.cuenta_id,
          texto: `${cuenta.cuenta_codigopadre}.${cuenta.cuenta_codigonivel} ${cuenta.cuenta_descripcion}`,
        }));
        return res.status(200).json(cuentas);
      })
      .catch((e) => {
        console.log(e);
        return res.status(404).json({ error: "Cuentas no encontradas" });
      });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error en el servidor", details: error.message });
  }
}

async function obtenerCuenta(req, res) {
  try {
    const { id } = req.params;
    await ModuleSQL.Cuenta.findOne({
      where: {
        cuenta_id: id,
      },
    })
      .then((result) => {
        return res.status(200).json(result);
      })
      .catch((e) => {
        console.log(e);
        return res.status(404).json({ error: "Cuenta no encontrada" });
      });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error en el servidor", details: error.message });
  }
}

async function obtenerCuentas(req, res) {
  try {
    await ModuleSQL.Cuenta.findAll()
      .then((result) => {
        return res.status(200).json(result);
      })
      .catch((e) => {
        console.log(e);
        return res.status(404).json({ error: "Cuentas no encontradas" });
      });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error en el servidor", details: error.message });
  }
}

async function exportarCuentasExcel(req, res) {
  try {
    const resultados = []; 
    //Obtener todas las cuentas de la BD
    const cuentas = await ModuleSQL.Cuenta.findAll();
    //Crear un mapa para almacenar las cuentas por su ID
    const cuentasMap = new Map();
    cuentas.forEach((cuenta) => {
      cuentasMap.set(cuenta.cuenta_id, cuenta);
    });
    //Obtención de grupos
    const grupos = cuentas.filter((cuenta) => cuenta.cuenta_idpadre === null)
    .sort((a, b) => a.cuenta_codigonivel.localeCompare(b.cuenta_codigonivel));
    //Función recursiva para explorar los hijos
    grupos.forEach((grupo) => {
      resultados.push({
        codigoCuenta: grupo.cuenta_codigonivel,
        cuentaContable: grupo.cuenta_descripcion,
        Naturaleza: grupo.cuenta_naturaleza,
      });
      // Obtener los hijos del grupo principal
      const hijos = Array.from(cuentasMap.values())
        .filter((cuenta) => cuenta.cuenta_idpadre === grupo.cuenta_id)
        .sort((a, b) =>
          a.cuenta_codigonivel.localeCompare(b.cuenta_codigonivel)
        );

      // Explorar los hijos recursivamente
      explorarHijos(hijos, cuentasMap, resultados);
    });

    console.log("Los resultados son ", resultados);

    return res.status(200).json(resultados);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error en el servidor", details: error.message });
  }
}

function explorarHijos(hijos, mapaCuentas, resultados) {
  if (!hijos || hijos.length === 0){
    return;
  } 
  hijos.forEach((hijo) => {
    const codigoCuenta = `${hijo.cuenta_codigopadre}.${hijo.cuenta_codigonivel}`;
    resultados.push({
     codigoCuenta: codigoCuenta,
     cuentaContable: hijo.cuenta_descripcion,
      Naturaleza: hijo.cuenta_naturaleza,
    });

    const hijosDelHijo = Array.from(mapaCuentas.values())
      .filter((cuenta) => cuenta.cuenta_idpadre === hijo.cuenta_id)
      .sort((a, b) => a.cuenta_codigonivel.localeCompare(b.cuenta_codigonivel));

    // Llamada recursiva para explorar los hijos del hijo
    explorarHijos(hijosDelHijo, mapaCuentas, resultados);
  });
}

module.exports = {
  crearCuenta,
  obtenerGrupos,
  obtenerCuentasHijas,
  obtenerCuentas,
  obtenerCuenta,
  exportarCuentasExcel,
};
