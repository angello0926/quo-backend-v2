var app = require('../app');
var request = require('supertest');
var faker = require('faker');
var should = require("should");

describe('authentication api', function() {
    var randomEmail = faker.internet.email(); 
    var randomPassword = faker.internet.password(); 
    let user = {
        email: randomEmail,
        password: randomPassword
    }
    it('should create an account', function(done) {
        request(app)
        .post('/api/auth/signup')
        .send(user)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .end(function(err, res) {
            res.status.should.equal(201);
            res.body.success.should.equal(true);
            done();
        });
    });

    let authenticatedUser = {
        email: "angelyukyu+haha@gmail.com",
        password: 'test123'
    }
    it('should log in', function(done) {
        request(app)
        .post('/api/auth/authenticate')
        .send(authenticatedUser)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .end(function(err, res) {
            res.status.should.equal(200);
            res.body.success.should.equal(true);
            done();
        });
    });
    let unauthenticatedUser = {
        email: faker.internet.email(),
        password: faker.internet.password()
    }

    it('should fail to login', function(done) {
        request(app)
        .post('/api/auth/authenticate')
        .send(unauthenticatedUser)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .end(function(err, res) {
            res.status.should.equal(401);
            res.body.success.should.equal(false);
            done();
        });
    });
});



