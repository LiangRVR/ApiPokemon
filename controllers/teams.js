const teamDatabase = {};

const bootstrapTeam = (userId) => {
  teamDatabase[userId] = [];
};

const getTeamOfUser = (userId) => {
  return teamDatabase[userId];
};

const addPokemon = (userId, pokemonName) => {
  teamDatabase[userId].push({ name: pokemonName });
};

const setTeam = (userId, team) => {
  teamDatabase[userId] = team;
};

exports.bootstrapTeam = bootstrapTeam;
exports.addPokemon = addPokemon;
exports.setTeam = setTeam;
exports.getTeamOfUser = getTeamOfUser;
