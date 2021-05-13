const express = require("express");
const router = express.Router();
const passport = require("passport");
const teamsController = require("../controllers/teams");
const { getUser } = require("../controllers/users");

//Import token's verification module
require("../auth")(passport);

//Routes
router
  .route("/")
  .get(passport.authenticate("jwt", { session: false }), (req, res) => {
    res.status(200).json({
      trainer: getUser(req.user.userId).userName,
      team: teamsController.getTeamOfUser(req.user.userId),
    });
  })
  .put(passport.authenticate("jwt", { session: false }), (req, res) => {
    teamsController.setTeam(req.user.userId, req.body.team);
    res.status(200).send();
  });

router.route("/pokemons").post((req, res) => {
  res.status(200).send("Hello World!");
});

router.route("/pokemons/:pokeid").delete((req, res) => {
  res.status(200).send("Hello World!");
});

exports.router = router;
