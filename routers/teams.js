const express = require("express");
const router = express.Router();
const passport = require("passport");
const axios = require("axios").default;
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

router
  .route("/pokemons")
  .post(passport.authenticate("jwt", { session: false }), (req, res) => {
    let pokemonName = req.body.name;
    console.log("Calling to pokeapi");
    axios
      .get(`https://pokeapi.co/api/v2/pokemon/${pokemonName.toLowerCase()}`)
      .then((response) => {
        // handle success

        let pokemon = {
          name: pokemonName,
          pokedexNumber: response.data.id,
        };

        teamsController.addPokemon(req.user.userId, pokemon);

        res.status(201).json(pokemon);
      })
      .catch((error) => {
        // handle error
        res.status(400).send({ message: error });
      })
      .then(() => {
        // always executed
      });
  });

router
  .route("/pokemons/:pokeid")
  .delete(passport.authenticate("jwt", { session: false }), (req, res) => {
    //Check if pokeid is correct
    let oldTeamLength = teamsController.getTeamOfUser(req.user.userId).length;

    if (req.params.pokeid > oldTeamLength - 1) {
      res
        .status(400)
        .send({ message: `Index must be less or equal to ${oldTeamLength}` });
    }

    //Deleting the pokemon of the team
    teamsController.deletePokemon(req.user.userId, req.params.pokeid);

    let newUserTeam = {
      trainer: getUser(req.user.userId).userName,
      team: teamsController.getTeamOfUser(req.user.userId),
    };

    res.status(200).json(newUserTeam);
  });

exports.router = router;
