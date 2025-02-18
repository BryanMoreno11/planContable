const express=module.require("express");
const conexionSequelize = require("./sequelize/database.js");
const app= express();
const cors = require("cors");
//middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//rutas
app.use("/api",require("./Routes/cuentaRoutes"));
//init
app.listen(3000);
conexionSequelize.authenticate();
console.log("server on port",3000);