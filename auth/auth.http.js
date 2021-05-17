const jwt = require("jsonwebtoken");

//Import controllers
const usersController = require("./users.controller");

const loginUser = (req, res) => {
  //Check if there is data in the request
  if (!req.body) {
    return res.status(400).json({ message: "Missing data" });
  }
  if (!req.body.user || !req.body.password) {
    return res.status(400).json({ message: "Missing data" });
  }

  //Check credentials
  usersController.checkUserCredentials(
    req.body.user,
    req.body.password,
    (err, result) => {
      if (err || !result) {
        //Error if the credential is wrong
        return res.status(401).json({ message: "Invalid credentials" });
      }

      //If the credential is ok, a token is made and sent
      let user = usersController.getUserIdFromUserName(req.body.user);
      const token = jwt.sign({ userId: user.userId }, "secretPassword");
      res.status(200).json({
        token: token,
      });
    }
  );
};

exports.loginUser = loginUser;
