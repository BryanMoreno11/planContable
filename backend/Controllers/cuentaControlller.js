const { where } = require("sequelize");
const { Cuenta } = require("../sequelize/models");
async function crearCuenta(req, res) {
  const {
    cuenta_idpadre,
    cuenta_descripcion,
    cuenta_codigopadre,
    cuenta_grupo,
    cuenta_naturaleza,
    cuenta_padre,
    cuenta_codigonivel,
  } = req.body;

  try {
    const nuevaCuenta = await Cuenta.create({
      cuenta_codigonivel: cuenta_codigonivel,
      cuenta_idpadre: cuenta_idpadre,
      cuenta_descripcion: cuenta_descripcion,
      cuenta_codigopadre: cuenta_codigopadre,
      cuenta_grupo: cuenta_grupo,
      cuenta_naturaleza: cuenta_naturaleza,
      cuenta_padre: cuenta_padre,
      cuenta_codigonivel: cuenta_codigonivel,
    });

    res
      .status(200)
      .json({ message: "Cuenta creada exitosamente", data: nuevaCuenta });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error en el servidor", details: error.message });
  }
}

async function obtenerGrupos(req, res) {
  try {
    Cuenta.findAll({
      where: {
        cuenta_idpadre: null,
      },
    })
      .then((result) => {
        const grupos= result.map((grupo) => ({
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
    await Cuenta.findAll({
      where: {
        cuenta_idpadre: id,
      },
    })
      .then((result) => {
        const cuentas=result.map((cuenta) => ({
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
    res.status(500).json({ error: "Error en el servidor", details: error.message });
  }
}

async function obtenerCuenta(req, res) {
  try {
    const { id } = req.params;
    await Cuenta.findOne({
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
   await Cuenta.findAll().then(
    (result)=>{
        return res.status(200).json(result);
    }
   ).catch(
    (e)=>{
        console.log(e);
        return res.status(404).json({error:"Cuentas no encontradas"});
    }

   );
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error en el servidor", details: error.message });
  }
}

module.exports = {
  crearCuenta,
  obtenerGrupos,
  obtenerCuentasHijas,
  obtenerCuentas,
  obtenerCuenta,
};
