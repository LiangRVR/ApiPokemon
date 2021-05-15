let teamDatabase = {};

const bootstrapTeam = (userId) => {
  teamDatabase[userId] = [];
};

const cleanUpTeam = () => {
  for (let user in teamDatabase) {
    teamDatabase[user] = [];
  }
};

const deletePokemon = (userId, pokeIndex) => {
  if (teamDatabase[userId][pokeIndex]) {
    teamDatabase[userId].splice(pokeIndex, 1);
  }
};

const getTeamOfUser = (userId) => {
  return teamDatabase[userId];
};

const addPokemon = (userId, pokemon) => {
  teamDatabase[userId].push(pokemon);
};

const setTeam = (userId, team) => {
  teamDatabase[userId] = team;
};

exports.bootstrapTeam = bootstrapTeam;
exports.addPokemon = addPokemon;
exports.setTeam = setTeam;
exports.getTeamOfUser = getTeamOfUser;
exports.cleanUpTeam = cleanUpTeam;
exports.deletePokemon = deletePokemon;
