import request from 'supertest';
import faker from 'faker';
import should from 'should';
let api = request('http://localhost:4000');

describe('authentication api', function() {
    let randomEmail = faker.internet.email(); 
    let randomPassword = faker.internet.password(); 
    let user = {
        email: randomEmail,
        password: randomPassword
    };
    it('should create an account', function() {
        return api
        .post('/api/auth/signup')
        .send(user)
        .set('Accept', 'application/json')
        .expect(201)
        .then(res => {
            res.status.should.equal(201);
            res.body.success.should.equal(true);
        })
        .catch(err =>{
            console.log(err);
        });
    });

    let invalidUser ={
        email: null,
        password: ''
    };
    it('should fail to create an account', function() {
        return api
        .post('/api/auth/signup')
        .send(invalidUser)
        .set('Accept', 'application/json')
        .expect(201)
        .then(res => {
            res.status.should.equal(201);
            res.body.success.should.equal(true);
        })
        .catch(err =>{
            console.log(err);
        });
    });


    let authenticatedUser = {
        email: 'angelyukyu+haha@gmail.com',
        password: 'test123'
    };
    it('should log in', function(done) {
        api
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
    };

    it('should fail to login', function(done) {
        api
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



