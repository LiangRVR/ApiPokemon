const express = require("express");
const router = express.Router();

const authHttpHandler = require("./auth.http");

//Routes
router.route("/login").post(authHttpHandler.loginUser);

exports.router = router;
