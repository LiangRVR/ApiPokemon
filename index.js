const express = require("express");

//Routes
const authRoutes = require("./routers/auth").router;
const teamRoutes = require("./routers/teams").router;

const app = express();
app.use(express.json());

const port = 3000;

app.get("/", (req, res) => {
  res.status(200).send("Hello World!");
});

app.use("/auth", authRoutes);
app.use("/teams", teamRoutes);

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});

exports.app = app;
