const jwt = require("jsonwebtoken");
const { to } = require("../tools/to");

//Import controllers
const usersController = require("./users.controller");

const loginUser = async (req, res) => {
  //Check if there is data in the request
  if (!req.body) {
    return res.status(400).json({ message: "Missing data" });
  }
  if (!req.body.user || !req.body.password) {
    return res.status(400).json({ message: "Missing data" });
  }

  //Check credentials
  let [err, result] = await to(
    usersController.checkUserCredentials(req.body.user, req.body.password)
  );

  if (err || !result) {
    //Error if the credential is wrong
    return res.status(401).json({ message: "Invalid credentials" });
  }

  //If the credential is ok, a token is made and sent
  let [getUserErr, user] = await to(
    usersController.getUserIdFromUserName(req.body.user)
  );
  if (getUserErr) {
    //Error if the credential is wrong
    return res.status(401).json({ message: getUserErr });
  }

  const token = jwt.sign({ userId: user.userId }, "secretPassword");
  res.status(200).json({
    token: token,
  });
};

exports.loginUser = loginUser;
