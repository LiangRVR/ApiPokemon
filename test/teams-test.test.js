const chai = require("chai");
const chaiHttp = require("chai-http");

chai.use(chaiHttp);

const app = require("../index").app;

describe("Teams's Test Suit", () => {
  it("Sould return 401 when there's no JWT token available", (done) => {
    //The key's call is wrong
    chai
      .request(app)
      .get("/teams")
      .end((err, res) => {
        chai.assert.equal(res.statusCode, 401);
        done();
      });
  });

  it("SHould return the team of the given user", (done) => {
    //Making the team
    let team = [{ name: "Charizard" }, { name: "Blastoide" }];
    //Login an User
    chai
      .request(app)
      .post("/auth/login")
      .set("content-type", "application/json")
      .send({ user: "LRVR", password: "123456" })
      .end((err, res) => {
        //Set the team
        chai.assert.equal(res.statusCode, 200);
        let token = res.body.token;
        chai
          .request(app)
          .put("/teams")
          .send({ team: team }) //sending the team
          .set("Authorization", `JWT ${token}`)
          .end((err, res) => {
            // Check if LRVR have Charizard y Blastoise in his team
            chai
              .request(app)
              .get("/teams")
              .set("Authorization", `JWT ${token}`)
              .end((err, res) => {
                /*
                Format:
                  {
                      trainer:"LRVR",
                      team:[...PokemonsName]
                  }
               */
                chai.assert.equal(res.statusCode, 200);
                chai.assert.equal(res.body.trainer, "LRVR");
                chai.assert.equal(res.body.team.length, team.length);
                for (let i = 0; i < team.length; i++) {
                  chai.assert.equal(res.body.team[i].name, team[i].name);
                }
                /*chai.assert.equal(res.body.team[0].name, "Charizard");
                chai.assert.equal(res.body.team[1].name, "Blastoide");*/
                done();
              });
          });
      });
  });
});
