const chai = require("chai");
const chaiHttp = require("chai-http");

chai.use(chaiHttp);

const app = require("../../index").app;

const usersController = require("../users.controller");

before(async () => {
  await usersController.registerUser("LRVR", "123456");
  await usersController.registerUser("LVDev", "654321");
});

describe("Auth's Test Suit", () => {
  it("Should return 400 when the data isn't provided", (done) => {
    //Expect valid login
    chai
      .request(app)
      .post("/auth/login")
      .end((err, res) => {
        chai.assert.equal(res.statusCode, 400);
        done();
      });
  });

  it("Should return 200 and token for succesfull login", (done) => {
    chai
      .request(app)
      .post("/auth/login")
      .set("content-type", "application/json")
      .send({ user: "LRVR", password: "123456" })
      .end((err, res) => {
        //Expect valid login
        chai.assert.equal(res.statusCode, 200);
        done();
      });
  });

  it("SHould return 200 if jwt will be valid", (done) => {
    chai
      .request(app)
      .post("/auth/login")
      .set("content-type", "application/json")
      .send({ user: "LVDev", password: "654321" })
      .end((err, res) => {
        chai.assert.equal(res.statusCode, 200);
        chai
          .request(app)
          .get("/teams")
          .set("Authorization", `JWT ${res.body.token}`)
          .end((err, res) => {
            chai.assert.equal(res.statusCode, 200);
            done();
          });
      });
  });
});

after(async () => {
  await usersController.cleanUpUsers();
});
