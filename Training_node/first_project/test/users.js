const chai = require('chai'),
  dictum = require('dictum.js'),
  server = require('./../app'),
  sessionManager = require('./../app/services/sessionManager'),
  should = chai.should();

const successfulLogin = cb => {
  return chai
    .request(server)
    .post('/users/sessions')
    .send({ email: 'julian.molina@wolox.com.ar', password: 'hola12345' });
};
describe('/users/sessions POST', () => {
  it('should fail login because of invalid username', done => {
    chai
      .request(server)
      .post('/users/sessions')
      .send({ email: 'julian.molina@wolox.com', password: 'hola12345' })
      .catch(err => {
        err.should.have.status(400);
        err.response.should.be.json;
        err.response.body.should.have.property('message');
        err.response.body.should.have.property('internal_code');
      })
      .then(() => done());
  });

  it('should fail login because of invalid password', done => {
    chai
      .request(server)
      .post('/users/sessions')
      .send({ username: 'julian.molina@wolox.com', password: 'invalid' })
      .catch(err => {
        err.should.have.status(400);
        err.response.should.be.json;
        err.response.body.should.have.property('message');
        err.response.body.should.have.property('internal_code');
      })
      .then(() => done());
  });

  it('should be successful', done => {
    successfulLogin()
      .then(res => {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.have.property('firstName');
        res.body.should.have.property('lastName');
        res.body.should.have.property('username');
        res.body.should.have.property('email');
        res.body.should.have.property('password');
        res.headers.should.have.property(sessionManager.HEADER_NAME);
        dictum.chai(res);
      })
      .then(() => done());
  });
});

describe('/users POST', () => {
  it('should fail because the password is invalid', done => {
    chai
      .request(server)
      .post('/users')
      .send({
        firstName: 'julian',
        lastName: 'sevilla',
        password: 'incorrect',
        email: 'julian.sevilla@wolox.com.ar'
      })
      .catch(err => {
        err.should.have.status(400);
        err.response.should.be.json;
        err.response.body.should.have.property('message');
        err.response.body.should.have.property('internal_code');
      })
      .then(() => done());
  });

  it('should fail because email is in use', done => {
    chai
      .request(server)
      .post('/users')
      .send({
        firstName: 'julian',
        lastName: 'molina',
        password: 'hola12345',
        email: 'julian.molina@wolox.com.ar'
      })
      .catch(err => {
        err.should.have.status(400);
        err.response.should.be.json;
        err.response.body.should.have.property('message');
        err.response.body.should.have.property('internal_code');
      })
      .then(() => done());
  });

  it('should fail because the first name was not send', done => {
    chai
      .request(server)
      .post('/users')
      .send({
        lastName: 'voboril',
        password: 'hola12345',
        email: 'lucas.voboril@wolox.com.ar'
      })
      .catch(err => {
        err.should.have.status(400);
        err.response.should.be.json;
        err.response.body.should.have.property('message');
        err.response.body.should.have.property('internal_code');
      })
      .then(() => done());
  });

  it('should be successful', done => {
    chai
      .request(server)
      .post('/users')
      .send({
        firstName: 'lucas',
        lastName: 'voboril',
        password: 'hola12345',
        email: 'lucas.voboril@wolox.com.ar'
      })
      .then(res => {
        res.should.have.status(200);
        dictum.chai(res);
      })
      .then(() => done());
  });
});
