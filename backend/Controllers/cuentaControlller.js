const SqlModule = require("../sequelize/models");
const ModuleSQL = require("../sequelize/models");
const Xlsx= require("xlsx");


async function crearCuenta(req, res) {
  try {
    //Para la creación de grupos principales
    if(req.body.cuenta_idpadre==null){
      req.body.cuenta_grupo= req.body.cuenta_descripcion;
    }

    await ModuleSQL.Cuenta.create(req.body)
      .then((cuenta) => {
        return res.status(200).json({ message: "Cuenta creada correctamente",
          id:cuenta.cuenta_id
         });
        
      })
      .catch((e) => {
        console.log(e);
        return res.status(404).json({ error: "Error al insertar" });
      });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error en el servidor", details: error.message });
  }
}


async function actualizarCuenta(req, res){
  try{
    const {id}= req.params;
    await SqlModule.Cuenta.update(req.body, {
      where: {
        cuenta_id: id,
      },
    })
    .then((result) => {
      return res.status(200).json({ message: "Cuenta actualizada correctamente" });
    })
    .catch((e) => {
      console.log(e);
      return res.status(404).json({ error: "Error al actualizar" });
    });

  }catch(err){
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
          ...grupo.toJSON(),
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
          ...cuenta.toJSON(),
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
    //Obtención de grupos
    const grupos = cuentas.filter((cuenta) => cuenta.cuenta_idpadre === null)
    .sort((a, b) => a.cuenta_codigonivel.localeCompare(b.cuenta_codigonivel));
    grupos.forEach((grupo) => {
      resultados.push({
        codigoCuenta: grupo.cuenta_codigonivel,
        cuentaContable: grupo.cuenta_descripcion,
        Naturaleza: grupo.cuenta_esdebito ? "Debito" : "Credito",
      });
      const hijos = cuentas.filter((cuenta) => cuenta.cuenta_idpadre === grupo.cuenta_id)
        .sort((a, b) =>
          a.cuenta_codigonivel.localeCompare(b.cuenta_codigonivel)
        );
      // Explorar los hijos de los grupos recursivamente
      explorarHijos(hijos, cuentas, resultados);
    });
    //Exportar archivo Excel
    res.setHeader('Content-Disposition', 'attachment; filename=PlanDeCuentas.xlsx');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    return res.send(generarExcel("Plan de cuentas", resultados));
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error en el servidor", details: error.message });
  }
}

function explorarHijos(hijos, cuentas, resultados) {
  if (!hijos || hijos.length === 0){
    return;
  } 
  hijos.forEach((hijo) => {
    const codigoCuenta = `${hijo.cuenta_codigopadre}.${hijo.cuenta_codigonivel}`;
    resultados.push({
     codigoCuenta: codigoCuenta,
     cuentaContable: hijo.cuenta_descripcion,
      Naturaleza: hijo.cuenta_esdebito ? "Debito" : "Credito",
    });

    const hijosDelHijo = cuentas
      .filter((cuenta) => cuenta.cuenta_idpadre === hijo.cuenta_id)
      .sort((a, b) => a.cuenta_codigonivel.localeCompare(b.cuenta_codigonivel));
    // Llamada recursiva para explorar los hijos del hijo
    explorarHijos(hijosDelHijo, cuentas, resultados);
  });

}

function generarExcel(nombreArchivo, datos){
  const workbook= Xlsx.utils.book_new();
  const worksheet = Xlsx.utils.json_to_sheet(datos);

  const range = Xlsx.utils.decode_range(worksheet['!ref']);
  worksheet['!autofilter'] = {
    ref: Xlsx.utils.encode_range({
      s: { c: 0, r: 0 }, // Inicio: columna 0 (A), fila 0 (1)
      e: { c: range.e.c, r: range.e.r }, // Fin: última columna y última fila
    }),
  };
  Xlsx.utils.book_append_sheet(workbook,worksheet, nombreArchivo);
  return Xlsx.write(workbook, { type: 'buffer', bookType: 'xlsx' });

}



module.exports = {
  crearCuenta,
  obtenerGrupos,
  obtenerCuentasHijas,
  obtenerCuentas,
  obtenerCuenta,
  exportarCuentasExcel,
  actualizarCuenta
};
