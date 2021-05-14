const uuid = require("uuid");
const crypto = require("../crypto");
const teamsController = require("./teams");
let userDatabase = {};
//userId -> userData

const registerUser = (userName, password) => {
  let hashedPassword = crypto.hashPasswordSync(password);
  //Save the user in the database
  let userId = uuid.v4();
  userDatabase[userId] = {
    userName: userName,
    password: hashedPassword,
  };

  teamsController.bootstrapTeam(userId);
};

const cleanUpUsers = () => {
  userDatabase = {};
};

const getUser = (userId) => {
  return userDatabase[userId];
};

const getUserIdFromUserName = (userName) => {
  for (let user in userDatabase) {
    if (userDatabase[user].userName == userName) {
      let userData = userDatabase[user];
      userData.userId = user;
      return userData;
    }
  }
};

const checkUserCredentials = (userName, password, done) => {
  //Check the credentials
  let user = getUserIdFromUserName(userName);
  if (user) {
    crypto.comparePassword(password, user.password, done);
  } else {
    done("Missing user");
  }
};

exports.registerUser = registerUser;
exports.checkUserCredentials = checkUserCredentials;
exports.getUser = getUser;
exports.getUserIdFromUserName = getUserIdFromUserName;
exports.cleanUpUsers = cleanUpUsers;
