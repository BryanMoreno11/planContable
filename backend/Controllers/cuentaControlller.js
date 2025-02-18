const { Cuenta } = require('../sequelize/models'); 
async function crearCuenta(req, res) {
    const { cuenta_idpadre, cuenta_descripcion, cuenta_codigopadre, cuenta_grupo, cuenta_naturaleza, cuenta_padre, cuenta_codigonivel  } = req.body;

    try {
        const nuevaCuenta = await Cuenta.create({
            cuenta_codigonivel: cuenta_codigonivel,
            cuenta_idpadre: cuenta_idpadre,
            cuenta_descripcion:cuenta_descripcion,
            cuenta_codigopadre:cuenta_codigopadre,
            cuenta_grupo:cuenta_grupo,
            cuenta_naturaleza:cuenta_naturaleza,
            cuenta_padre:cuenta_padre,
            cuenta_codigonivel:cuenta_codigonivel
        });

        res.status(200).json({ message: "Cuenta creada exitosamente", data: nuevaCuenta });
    } catch (error) {
        res.status(500).json({ error: "Error en el servidor", details: error.message });
    }
}

async function obtenerGrupos(req, res) {
    try {
        const grupos = await Cuenta.findAll({
            where: {
                cuenta_idpadre: null
            },
         
        
        });
        const gruposMap = grupos.map(grupo => ({
            cuenta_id:grupo.cuenta_id,
            cuenta_descripcion: grupo.cuenta_descripcion,
            cuenta_codigonivel: grupo.cuenta_codigonivel,
            texto: `${grupo.cuenta_codigonivel} ${grupo.cuenta_descripcion}`
        }));

        res.status(200).json(gruposMap);
    } catch (error) {
        res.status(500).json({ error: "Error en el servidor", details: error.message });
    }
}

async function obtenerCuentasHijas(req, res) {
    const { id} = req.params;

    try {
        const cuentasHijas = await Cuenta.findAll({
            where: {
                cuenta_idpadre: id
            }

        });

        if (cuentasHijas.length > 0) {
            const cuentasHijasMap=cuentasHijas.map(cuenta=>({
                cuenta_id:cuenta.cuenta_id,
                cuenta_codigopadre:cuenta.cuenta_codigopadre,
                cuenta_codigonivel: cuenta.cuenta_codigonivel,
                cuenta_descripcion: cuenta.cuenta_descripcion,
                texto: `${cuenta.cuenta_codigopadre}.${cuenta.cuenta_codigonivel} ${cuenta.cuenta_descripcion}`
            }));
            res.status(200).json(cuentasHijasMap);
        } else {
            res.status(404).json({ error: "Cuenta no encontrada" });
        }
    } catch (error) {
        res.status(500).json({ error: "Error en el servidor", details: error.message });
    }
}


async function obtenerCuentas(req, res) {
    try {
        const cuentas = await Cuenta.findAll();
        res.status(200).json(cuentas);
    } catch (error) {
        res.status(500).json({ error: "Error en el servidor", details: error.message });
    }
}





module.exports = {
    crearCuenta,
    obtenerGrupos,
    obtenerCuentasHijas,
    obtenerCuentas
};