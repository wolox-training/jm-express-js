const chai = require('chai'),
  dictum = require('dictum.js'),
  server = require('./../app'),
  sessionManager = require('./../app/services/sessionManager'),
  logger = require('../app/logger'),
  nock = require('nock'),
  sleep = require('sleep'),
  config = require('../config'),
  User = require('../app/models').user,
  should = chai.should(),
  albumListUrl = `${config.common.urlRequests.base}${config.common.urlRequests.albumList}`,
  photoListUrl = `${config.common.urlRequests.base}${config.common.urlRequests.photos}`,
  oneAlbum = {
    userId: 1,
    id: 1,
    title: 'quidem molestiae enim'
  },
  albumTwo = {
    userId: 1,
    id: 2,
    title: 'sunt qui excepturi placeat culpa'
  },
  onePhoto = {
    albumId: 2,
    id: 51,
    title: 'non sunt voluptatem placeat consequuntur rem incidunt',
    url: 'http://placehold.it/600/8e973b',
    thumbnailUrl: 'http://placehold.it/150/8e973b'
  };

const successfulLogin = (userEmail = 'julian.molina@wolox.com.ar') => {
  return chai
    .request(server)
    .post('/users/sessions')
    .send({ email: userEmail, password: 'hola12345' });
};

exports.successfulLogin = successfulLogin();

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
      .send({ email: 'julian.molina@wolox.com.ar', password: 'invalid' })
      .catch(err => {
        err.should.have.status(400);
        err.response.should.be.json;
        err.response.body.should.have.property('message');
        err.response.body.should.have.property('internal_code');
      })
      .then(() => done());
  });

  it('should be successful login', done => {
    successfulLogin()
      .then(res => {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.have.property('firstName');
        res.body.should.have.property('lastName');
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
        firstName: 'ignacio',
        lastName: 'nieva',
        password: 'false',
        email: 'ignacio.nieva@wolox.com.ar'
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

describe('/users GET', () => {
  it('should be successful with one page', done => {
    successfulLogin()
      .then(loginRes => {
        return chai
          .request(server)
          .get('/users?limit=2&page=1')
          .set(sessionManager.HEADER_NAME, loginRes.headers[sessionManager.HEADER_NAME])
          .then(res => {
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.have.property('users');
            res.body.users.length.should.eql(2);
            dictum.chai(res);
          });
      })
      .then(() => done());
  });

  it('should be successful with two pages', done => {
    successfulLogin()
      .then(loginRes => {
        return chai
          .request(server)
          .get('/users?limit=1&page=2')
          .set(sessionManager.HEADER_NAME, loginRes.headers[sessionManager.HEADER_NAME])
          .then(res => {
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.have.property('users');
            res.body.users.length.should.eql(1);
            dictum.chai(res);
          });
      })
      .then(() => done());
  });

  it('should fail because page not found', done => {
    successfulLogin()
      .then(loginRes => {
        return chai
          .request(server)
          .get('/users?limit=2&page=2')
          .set(sessionManager.HEADER_NAME, loginRes.headers[sessionManager.HEADER_NAME])
          .catch(err => {
            err.should.have.status(400);
            err.response.should.be.json;
            err.response.body.should.have.property('message');
            err.response.body.should.have.property('internal_code');
          });
      })
      .then(() => done());
  });

  it('should fail because limit did not sent', done => {
    successfulLogin()
      .then(loginRes => {
        return chai
          .request(server)
          .get('/users?page=2')
          .set(sessionManager.HEADER_NAME, loginRes.headers[sessionManager.HEADER_NAME])
          .catch(err => {
            err.should.have.status(400);
            err.response.should.be.json;
            err.response.body.should.have.property('message');
            err.response.body.should.have.property('internal_code');
          });
      })
      .then(() => done());
  });
});

describe('/admin/users POST', () => {
  it('should fail because the user logged in is doesnt admin', done => {
    chai
      .request(server)
      .post('/admin/users')
      .send({ email: 'julian.sevilla@wolox.com.ar', password: 'hola12345' })
      .catch(err => {
        err.should.have.status(401);
      })
      .then(() => done());
  });

  it('should fail because the password is invalid', done => {
    successfulLogin().then(loginRes => {
      return chai
        .request(server)
        .post('/admin/users')
        .set(sessionManager.HEADER_NAME, loginRes.headers[sessionManager.HEADER_NAME])
        .send({
          firstName: 'julian',
          lastName: 'sevilla',
          password: 'false',
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
  });

  it('should fail because the first name was not send', done => {
    successfulLogin().then(loginRes => {
      return chai
        .request(server)
        .post('/admin/users')
        .set(sessionManager.HEADER_NAME, loginRes.headers[sessionManager.HEADER_NAME])
        .send({
          lastName: 'sevilla',
          password: 'hola12345',
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
  });

  it('should be successful because the sent user was configured that admin', done => {
    successfulLogin()
      .then(loginRes => {
        return chai
          .request(server)
          .post('/admin/users')
          .set(sessionManager.HEADER_NAME, loginRes.headers[sessionManager.HEADER_NAME])
          .send({
            firstName: 'pablo',
            lastName: 'cid',
            password: 'hola12345',
            email: 'pablo.cid@wolox.com.ar'
          })
          .then(res => {
            res.should.have.status(200);
            User.getByEmail('pablo.cid@wolox.com.ar').then(u => {
              u.admin.should.eql(true);
            });
            dictum.chai(res);
          });
      })
      .then(() => done());
  });
  it('should be successful creating admin', done => {
    successfulLogin()
      .then(loginRes => {
        return chai
          .request(server)
          .post('/admin/users')
          .set(sessionManager.HEADER_NAME, loginRes.headers[sessionManager.HEADER_NAME])
          .send({
            firstName: 'gonzalo',
            lastName: 'escandarani',
            password: 'hola12345',
            email: 'gonzalo.escandarani@wolox.com.ar'
          })
          .then(res => {
            res.should.have.status(200);
            User.getByEmail('gonzalo.escandarani@wolox.com.ar').then(u => {
              u.admin.should.eql(true);
            });
            dictum.chai(res);
          });
      })
      .then(() => done());
  });
});

describe('/users/:user_id/albums GET', () => {
  beforeEach(() => {
    nock(albumListUrl)
      .get('/2')
      .reply(200, albumTwo);
  });
  it('should be successful', done => {
    successfulLogin().then(res => {
      return chai
        .request(server)
        .post('/albums/2')
        .set(sessionManager.HEADER_NAME, res.headers[sessionManager.HEADER_NAME])
        .then(json1 => {
          successfulLogin().then(res2 => {
            return chai
              .request(server)
              .get('/users/3/albums')
              .set(sessionManager.HEADER_NAME, res.headers[sessionManager.HEADER_NAME])
              .then(json => {
                json.should.have.status(200);
                json.should.be.json;
                json.body.should.have.property('albums');
                json.body.albums.length.should.eqls(1);
              })
              .then(() => done());
          });
        });
    });
  });
  it('should be fail because the user is not admin and wants to see another users albums ', done => {
    successfulLogin('julian.sevilla@wolox.com.ar').then(res => {
      return chai
        .request(server)
        .get('/users/3/albums')
        .set(sessionManager.HEADER_NAME, res.headers[sessionManager.HEADER_NAME])
        .catch(err => {
          err.should.have.status(400);
          err.response.should.be.json;
          err.response.body.should.have.property('message');
          err.response.body.should.have.property('internal_code');
        })
        .then(() => done());
    });
  });
});

describe('/users/albums/:id/photos GET', () => {
  beforeEach(() => {
    nock(config.common.urlRequests.base)
      .get('/photos?albumId=2')
      .reply(200, onePhoto);
  });
  it('should be successful', done => {
    successfulLogin().then(res => {
      return chai
        .request(server)
        .post('/albums/2')
        .set(sessionManager.HEADER_NAME, res.headers[sessionManager.HEADER_NAME])
        .then(json => {
          successfulLogin().then(res2 => {
            return chai
              .request(server)
              .get('/users/albums/2/photos')
              .set(sessionManager.HEADER_NAME, res.headers[sessionManager.HEADER_NAME])
              .then(json1 => {
                json1.should.have.status(200);
                json1.should.be.json;
                json1.body.should.have.property('photos');
              })
              .then(() => done());
          });
        });
    });
  });
  it('should be fail because the user cant do the operation', done => {
    successfulLogin('julian.sevilla@wolox.com.ar').then(res2 => {
      return chai
        .request(server)
        .get('/users/albums/2/photos')
        .set(sessionManager.HEADER_NAME, res2.headers[sessionManager.HEADER_NAME])
        .catch(err => {
          err.should.have.status(400);
          err.response.should.be.json;
          err.response.body.should.have.property('message');
          err.response.body.should.have.property('internal_code');
        })
        .then(() => done());
    });
  });
});

describe('test for login expiration', () => {
  it('should be fail because the session expired', done => {
    successfulLogin()
      .then(loginRes => {
        sleep.sleep(5);
        return chai
          .request(server)
          .get('/users?limit=2&page=1')
          .set(sessionManager.HEADER_NAME, loginRes.headers[sessionManager.HEADER_NAME])
          .catch(err => {
            err.should.have.status(401);
          });
      })
      .then(() => done());
  });
  it('should be success because the session dont expire', done => {
    successfulLogin()
      .then(loginRes => {
        return chai
          .request(server)
          .get('/users?limit=2&page=1')
          .set(sessionManager.HEADER_NAME, loginRes.headers[sessionManager.HEADER_NAME])
          .then(res => {
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.have.property('users');
            res.body.users.length.should.eql(2);
          });
      })
      .then(() => done());
  });
});

describe('/users/sessions/invalidate_all POST', () => {
  it('should be fail because the session went invalidate', done => {
    successfulLogin()
      .then(loginRes => {
        return chai
          .request(server)
          .get('/users?limit=2&page=1')
          .set(sessionManager.HEADER_NAME, loginRes.headers[sessionManager.HEADER_NAME])
          .then(res => {
            return chai
              .request(server)
              .post('/users/sessions/invalidate_all')
              .set(sessionManager.HEADER_NAME, loginRes.headers[sessionManager.HEADER_NAME])
              .then(resInvalidate => {
                return chai
                  .request(server)
                  .get('/users?limit=2&page=1')
                  .set(sessionManager.HEADER_NAME, loginRes.headers[sessionManager.HEADER_NAME])
                  .catch(err => {
                    err.status(401);
                  });
              });
          });
      })
      .then(() => done());
  });

  it('should be sucessful because the sessions went invalidate but the user who disabled the sessions can continue to operate ', done => {
    successfulLogin()
      .then(loginRes => {
        return chai
          .request(server)
          .get('/users?limit=2&page=1')
          .set(sessionManager.HEADER_NAME, loginRes.headers[sessionManager.HEADER_NAME])
          .then(res => {
            return chai
              .request(server)
              .post('/users/sessions/invalidate_all')
              .set(sessionManager.HEADER_NAME, loginRes.headers[sessionManager.HEADER_NAME])
              .then(resInvalidate => {
                return chai
                  .request(server)
                  .get('/users?limit=2&page=1')
                  .set(sessionManager.HEADER_NAME, resInvalidate.headers[sessionManager.HEADER_NAME])
                  .then(resInvalidateOk => {
                    resInvalidateOk.should.have.status(200);
                    resInvalidateOk.should.be.json;
                    resInvalidateOk.body.should.have.property('users');
                    resInvalidateOk.body.users.length.should.eql(2);
                    dictum.chai(resInvalidateOk);
                  });
              });
          });
      })
      .then(() => done());
  });
});
