const chai = require("chai");
const chaiHttp = require("chai-http");

chai.use(chaiHttp);

const app = require("../../index").app;

const usersController = require("../../auth/users.controller");
const teamsController = require("../teams.controller");

before((done) => {
  usersController.registerUser("LRVR", "123456");
  usersController.registerUser("LVDev", "654321");
  done();
});

beforeEach((done) => {
  teamsController.cleanUpTeam();
  done();
});

describe("Teams's Test Suit", () => {
  it("Should return 401 when there's no JWT token available", (done) => {
    //The key's call is wrong
    chai
      .request(app)
      .get("/teams")
      .end((err, res) => {
        chai.assert.equal(res.statusCode, 401);
        done();
      });
  });

  it("Should return the team of the given user, sending a team", (done) => {
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

  it("Should return the team of the given user and a pokedex number, sending a pokemon", (done) => {
    //Set a pokemon name
    let pokemonName = "Bulbasaur";
    //Login an User
    chai
      .request(app)
      .post("/auth/login")
      .set("content-type", "application/json")
      .send({ user: "LRVR", password: "123456" })
      .end((err, res) => {
        //Send the first pokemon
        chai.assert.equal(res.statusCode, 200);
        let token = res.body.token;
        chai
          .request(app)
          .post("/teams/pokemons")
          .send({ name: pokemonName }) //sending the team
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
                      trainer: user,
                      team: [...PokemonsName]
                  }
               */
                chai.assert.equal(res.statusCode, 200);
                chai.assert.equal(res.body.trainer, "LRVR");
                chai.assert.equal(res.body.team.length, 1);
                chai.assert.equal(res.body.team[0].name, pokemonName);
                chai.assert.equal(res.body.team[0].pokedexNumber, 1);
                done();
              });
          });
      });
  });

  it("Should delete a pokemon of the team and return the new team, sending a pokemon index", (done) => {
    //Making the team
    let team = [
      { name: "Charizard" },
      { name: "Blastoide" },
      { name: "Bulbasaur" },
      { name: "Charmander" },
      { name: "Squirtle" },
      { name: "Pidgey" },
    ];
    let index = 5;
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
            // Check if LRVR have the team created before
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

                //Delete one pokemon
                chai
                  .request(app)
                  .delete(`/teams/pokemons/${index}`)
                  .set("Authorization", `JWT ${token}`)
                  .end((err, res) => {
                    //Should return a team without one element
                    chai.assert.equal(res.statusCode, 200);
                    chai.assert.equal(res.body.trainer, "LRVR");
                    chai.assert.equal(res.body.team.length, team.length - 1);
                    //Checking every element of the new team
                    for (let i = 0, j = 0; i < res.body.team.length; i++, j++) {
                      if (j == index) {
                        j++;
                      }
                      chai.assert.equal(res.body.team[i].name, team[j].name);
                    }
                  });

                done();
              });
          });
      });
  });
});

after((done) => {
  usersController.cleanUpUsers();
  done();
});
