const axios = require("axios").default;
const teamsController = require("./teams.controller");
const { getUser } = require("../auth/users.controller");

const getTeamFromUser = (req, res) => {
  res.status(200).json({
    trainer: getUser(req.user.userId).userName,
    team: teamsController.getTeamOfUser(req.user.userId),
  });
};

const setTeamToUser = (req, res) => {
  teamsController.setTeam(req.user.userId, req.body.team);
  res.status(200).send();
};

const addPokemToTeam = (req, res) => {
  let pokemonName = req.body.name;
  //Calling to pokeapi
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
};

const deletePokemonFromTeam = (req, res) => {
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
};

exports.getTeamFromUser = getTeamFromUser;
exports.setTeamToUser = setTeamToUser;
exports.addPokemToTeam = addPokemToTeam;
exports.deletePokemonFromTeam = deletePokemonFromTeam;
