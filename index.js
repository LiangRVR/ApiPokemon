const express = require("express");

//Routes
const authRoutes = require("./auth/auth.router").router;
const teamRoutes = require("./teams/teams.router").router;

const app = express();
app.use(express.json());

const port = 3000;

app.get("/", (req, res) => {
  res.status(200).send("Hello World!");
});

app.use("/auth", authRoutes);
app.use("/teams", teamRoutes);

app.listen(port, () => {
  console.log(`Server started at port ${port}`);
});

exports.app = app;
