const uuid = require("uuid");
const crypto = require("../tools/crypto");
const teamsController = require("../teams/teams.controller");
const { to } = require("../tools/to");
const mongoose = require("mongoose");

//Macking the user's sckema
const userModel = mongoose.model("userModel", {
  userId: String,
  userName: String,
  password: String,
});

let userDatabase = {};
//userId -> userData

const registerUser = (userName, password) => {
  return new Promise(async (resolve, reject) => {
    let hashedPassword = crypto.hashPasswordSync(password);
    //Save the user in the database
    let userId = uuid.v4();

    let newUser = new userModel({
      userId: userId,
      userName: userName,
      password: hashedPassword,
    });

    await newUser.save();

    await teamsController.bootstrapTeam(userId);
    resolve();
  });
};

const cleanUpUsers = () => {
  return new Promise(async (resolve, reject) => {
    await userModel.deleteMany({}).exec();
    resolve();
  });
};

const getUser = (userId) => {
  return new Promise(async (resolve, reject) => {
    let [err, result] = await to(userModel.findOne({ userId: userId }).exec());
    if (err) {
      reject(err);
    }
    resolve(result);
  });
};

const getUserIdFromUserName = (userName) => {
  return new Promise(async (resolve, reject) => {
    let [err, result] = await to(
      userModel.findOne({ userName: userName }).exec()
    );
    if (err) {
      reject(err);
    }
    resolve(result);
  });
};

const checkUserCredentials = (userName, password) => {
  //Check the credentials
  return new Promise(async (resolve, reject) => {
    let [userErr, user] = await to(getUserIdFromUserName(userName));
    if (user) {
      crypto.comparePassword(password, user.password, (err, result) => {
        if (err) {
          return reject(err);
        } else {
          return resolve(result);
        }
      });
    } else {
      reject("Missing user");
    }
  });
};

exports.registerUser = registerUser;
exports.checkUserCredentials = checkUserCredentials;
exports.getUser = getUser;
exports.getUserIdFromUserName = getUserIdFromUserName;
exports.cleanUpUsers = cleanUpUsers;
