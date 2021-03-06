const express = require("express");
const middlewares = require("./middlewares");
require("dotenv").config();//Load .env file

//Database
require("./database");

//Routes's import
const authRoutes = require("./auth/auth.router").router;
const teamRoutes = require("./teams/teams.router").router;

const app = express();

//Middlewares
middlewares.setupMiddlewares(app);

const port = process.env.PORT || 3000;

//Routes
app.get("/", (req, res) => {
  res.status(200).send("Hello World!");
});

app.use("/auth", authRoutes);
app.use("/teams", teamRoutes);

app.listen(port, () => {
  console.log(`Server started at port ${port}`);
});

exports.app = app;
