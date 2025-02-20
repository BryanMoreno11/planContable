const { Sequelize } = require('sequelize');	
//cadena de conexión
const conexionSequelize = new Sequelize({
    host: '127.0.0.1',
    username: 'postgres',
    password: 'admin',
    database: 'plan_cuenta',
    port: '5432',
    dialect: 'postgres',
    logging:false,
    define: {
        timestamps: false,
    }
});
//exportación
module.exports = conexionSequelize;