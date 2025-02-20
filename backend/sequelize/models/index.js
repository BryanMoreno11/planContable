const { DataTypes } = require("sequelize");
const sequelize = require("../index");

const Cuenta = sequelize.define('Cuenta',{
      cuenta_id :{
          type:DataTypes.INTEGER,
          primaryKey:true,
          autoIncrement:true
      },
     
      cuenta_grupo:{
          type:DataTypes.STRING(100),
          allowNull:false
      },
      cuenta_idpadre:{
          type:DataTypes.INTEGER,
          allowNull:true,
          references:{
              model:'cuenta',
              key:'cuenta_id'
          }
      },
      cuenta_codigopadre: {
          type: DataTypes.STRING(100),
          allowNull: true
        },
        cuenta_padre: {
          type: DataTypes.STRING(100),
          allowNull: true
        },
        cuenta_codigonivel: {
          type: DataTypes.STRING(100),
          allowNull: false
        },
        cuenta_descripcion: {
          type: DataTypes.STRING(500),
          allowNull: false
        },
        cuenta_naturaleza: {
          type: DataTypes.STRING(100),
          allowNull: false
        }
     
  }, {
      tableName: "cuenta", 
      timestamps: false 
});


Cuenta.belongsTo(Cuenta, {
  foreignKey: "cuenta_idpadre",
  as: "padre"
});

Cuenta.hasMany(Cuenta, {
  foreignKey: "cuenta_idpadre",
  as: "hijos"
});

const SqlModule = {
  Cuenta
};  
module.exports = SqlModule;