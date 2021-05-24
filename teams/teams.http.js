const axios = require("axios").default;
const teamsController = require("./teams.controller");
const { getUser } = require("../auth/users.controller");
const { to } = require("../tools/to");

const getTeamFromUser = async (req, res) => {
  let user = await getUser(req.user.userId);
  let [teamErr, team] = await to(
    teamsController.getTeamOfUser(req.user.userId)
  );
  if (teamErr) {
    return res.status(400).json({ message: teamErr });
  }
  res.status(200).json({
    trainer: user.userName,
    team: team,
  });
};

const setTeamToUser = async (req, res) => {
  let [err, resp] = await to(
    teamsController.setTeam(req.user.userId, req.body.team)
  );
  if (err) {
    return res.status(400).json({ message: err });
  }
  res.status(200).send();
};

const addPokemToTeam = async (req, res) => {
  let pokemonName = req.body.name;
  //Calling to pokeapi
  let [pokeApiError, pokeApiResponse] = await to(
    axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonName.toLowerCase()}`)
  );

  if (pokeApiError) {
    return res.status(400).json({ messag: pokeApiError });
  }

  let pokemon = {
    name: pokemonName,
    pokedexNumber: pokeApiResponse.data.id,
  };

  let [errorAdd, responseAdd] = await to(
    teamsController.addPokemon(req.user.userId, pokemon)
  );

  if (errorAdd) {
    return res.status(400).json({ message: "Already have 6 pokemon" });
  }

  res.status(201).json(pokemon);
};

const deletePokemonFromTeam = async (req, res) => {
  //Deleting the pokemon of the team
  let [delErr, resp] = await to(
    teamsController.deletePokemon(req.user.userId, req.params.pokeid)
  );
  if (delErr) {
    return res.status(400).json({ messag: delErr });
  }

  let user = await getUser(req.user.userId);
  let [getTeamErr, team] = await to(
    teamsController.getTeamOfUser(req.user.userId)
  );

  if (getTeamErr) {
    return res.status(400).json({ messag: getTeamErr });
  }

  let newUserTeam = {
    trainer: user.userName,
    team: team,
  };

  res.status(200).json(newUserTeam);
};

exports.getTeamFromUser = getTeamFromUser;
exports.setTeamToUser = setTeamToUser;
exports.addPokemToTeam = addPokemToTeam;
exports.deletePokemonFromTeam = deletePokemonFromTeam;
