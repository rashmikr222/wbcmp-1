
//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

// Import necessary libraries
// const express = require("express");
const chai = require("chai");
const { expect } = chai;
const chaihttp = require("chai-http");
const should = chai.should();
const server = require("../src/index");
// const app = express();

chai.use(chaihttp);

describe("First test collection", () => {
  it("test default welcome route", (done) => {
    chai
      .request(server)
      .get("/api/get-masterData")
      .end((err, res) => {
        if (err) {
          console.log("error----", err);
        }
        res.should.have.status(200);
        res.body.should.be.a("array");
        done();
      });

    // expect(actualVal).to.be.equal(expectedVal);
  });
});
