const express = require("express");
const authMiddleware = require("./tools/auth-middleware");

const setupMiddlewares = (app) => {
  app.use(express.json());
  authMiddleware.init();
  app.use(authMiddleware.protectWithJwt);
};

exports.setupMiddlewares = setupMiddlewares;
