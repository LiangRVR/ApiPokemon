const chai = require("chai");
const chaiHttp = require("chai-http");

chai.use(chaiHttp);

const app = require("../../index").app;

describe("e2e Test Course Suit", () => {
  it("Should return Hello World!", (done) => {
    chai
      .request(app)
      .get("/")
      .end((err, res) => {
        chai.assert.equal(res.text, "Hello World!");
        done();
      });
  });
});
