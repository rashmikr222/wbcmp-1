//npm i chai chai-http

const chai = require('chai'),
    should = chai.should(),
    expect = chai.expect;
const chaiHttp = require('chai-http');
// const { response } = require('../index');
// const server = require("../src/index");
chai.use(chaiHttp);
const { con } = require('../src/database/connection')
const app = require('../src/index')
//describe.skip("   ", ()=>{...})

describe("Api signup", () => {      //npm i mocha, chai, should= chai.should()
    after(function () {
        console.log("After the suit..");    //Will execute after the test suit is done.
    });
    before(function () {
        console.log("Before the suit..");   //Will execute before the test suit starts.
    });
    afterEach(function () {
        console.log("After each test case..");  //Will execute after each test case.
    });
    beforeEach(function () {
        console.log("Before each test case.."); //Will execute before each test case.
    });

    // it("Sample test", () => {
    //     let a = 10;
    //     let b = 10;
    //     expect(a).to.be.equal(b);
    //     a.should.equal(b);
    // })
    // con.getConnection(function (err, connection) {
        it("test for happy case", (done) => {
            // this.timeout(0);
            const data = {
                "fullName": "amarendra",
                "email": "rashmi.kr211@dollarbirdinc.com",
                "phoneNumber": 92123456781,
                "password":"Rashmi@22!"
            }
            chai.request(app).post('/api/signup').send(data).end((error, response) => {
                response.should.have.status(201);
                response.body.should.be.an('object');
                response.body.should.have.keys("fullname", "email", "phoneNumber", "password");
                done();
            })
        })
    // })



})


describe.skip("Api bad request", () => {      //npm i mocha, chai, should= chai.should()
    after(function () {
        console.log("After the suit..");    //Will execute after the test suit is done.
    });
    before(function () {
        console.log("Before the suit..");   //Will execute before the test suit starts.
    });
    afterEach(function () {
        console.log("After each test case..");  //Will execute after each test case.
    });
    beforeEach(function () {
        console.log("Before each test case.."); //Will execute before each test case.
    });

    // it("Sample test", () => {
    //     let a = 10;
    //     let b = 10;
    //     expect(a).to.be.equal(b);
    //     a.should.equal(b);
    // })

    it("test for bad request case", (done) => {
        const data = {
            "fullName": "amarendra",
            "email": "rashmi.kr@dollarbirdinc.com",
            "phoneNumber": 9812345678,
            "password":"Rashmi@22!"
        }
        chai.request(app).post('/api/signup').send(data).end((error, response) => {
            response.should.have.status(400);
            response.body.should.be.an('object');
            response.body.should.have.keys("data", "message");
            response.body.data.should.have.keys("name", "code", "description", "statusCode");
            expect(response.body.data.name).to.be.equal("BadRequestError");
            expect(response.body.data.code).to.be.equal("invalid_signup");
            expect(response.body.data.description).to.be.equal("Invalid sign up");
            expect(response.body.data.statusCode).to.be.equal(400);
            expect(response.body.message).to.be.equal("Please verify the email or User already exist!");
            done();
        })
    })
})