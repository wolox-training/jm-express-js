const chai = require('chai'),
  dictum = require('dictum.js'),
  server = require('./../app'),
  should = chai.should();

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
