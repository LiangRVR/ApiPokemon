const mongoose = require("mongoose");
const { to } = require("../tools/to");

//Macking the teams's sckema
const teamsModel = mongoose.model("teamsModel", {
  userId: String,
  team: [],
});

const bootstrapTeam = (userId) => {
  return new Promise(async (resolve, reject) => {
    let newTeam = new teamsModel({
      userId: userId,
      team: [],
    });
    await newTeam.save();
    resolve();
  });
};

const getTeamOfUser = (userId) => {
  return new Promise(async (resolve, reject) => {
    let [err, userTeam] = await to(
      teamsModel.findOne({ userId: userId }).exec()
    );
    if (err) {
      return reject(err);
    }
    resolve(userTeam.team);
  });
};

const addPokemon = (userId, pokemon) => {
  return new Promise(async (resolve, reject) => {
    let [err, userTeam] = await to(
      teamsModel.findOne({ userId: userId }).exec()
    );
    if (err) {
      return reject(err);
    }
    if (userTeam.team.length == 6) {
      reject("Alredy have 6 pokemons");
    } else {
      userTeam.team.push(pokemon);
      await userTeam.save();
      resolve();
    }
  });
};

const deletePokemon = (userId, pokeIndex) => {
  return new Promise(async (resolve, reject) => {
    let [err, userTeam] = await to(
      teamsModel.findOne({ userId: userId }).exec()
    );
    if (err) {
      return reject(err);
    }
    if (pokeIndex > userTeam.team.length - 1) {
      reject(`Index must be less or equal to ${userTeam.team.length - 1}`);
    } else if (userTeam.team[pokeIndex]) {
      userTeam.team.splice(pokeIndex, 1);
      await userTeam.save();
      resolve();
    }
  });
};

const cleanUpTeam = () => {
  return new Promise(async (resolve, reject) => {
    await teamsModel.deleteMany({}).exec();
    resolve();
  });
};

const setTeam = (userId, team) => {
  return new Promise(async (resolve, reject) => {
    let [err, userTeam] = await to(
      teamsModel.findOne({ userId: userId }).exec()
    );
    if (err) {
      return reject(err);
    }
    userTeam.team = team;
    await userTeam.save();
    resolve();
  });
};

exports.bootstrapTeam = bootstrapTeam;
exports.addPokemon = addPokemon;
exports.setTeam = setTeam;
exports.getTeamOfUser = getTeamOfUser;
exports.cleanUpTeam = cleanUpTeam;
exports.deletePokemon = deletePokemon;
