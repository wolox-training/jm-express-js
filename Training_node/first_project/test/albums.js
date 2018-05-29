const chai = require('chai'),
  dictum = require('dictum.js'),
  server = require('./../app'),
  nock = require('nock'),
  user = require('./../app/models').user,
  album = require('./../app/models').album,
  sessionManager = require('./../app/services/sessionManager'),
  logger = require('../app/logger'),
  config = require('../config'),
  testUser = require('../test/users'),
  should = chai.should(),
  albumListUrl = `${config.common.urlRequests.base}${config.common.urlRequests.albumList}`,
  oneAlbum = {
    userId: 1,
    id: 1,
    title: 'quidem molestiae enim'
  },
  albumTwo = {
    userId: 1,
    id: 2,
    title: 'sunt qui excepturi placeat culpa'
  };

describe('/albums GET', () => {
  nock(albumListUrl)
    .get('')
    .reply(200, oneAlbum);
  it('should be successful', done => {
    testUser.successfulLogin.then(res => {
      return chai
        .request(server)
        .get('/albums')
        .set(sessionManager.HEADER_NAME, res.headers[sessionManager.HEADER_NAME])
        .then(json => {
          json.should.have.status(200);
          json.body.should.have.property('albums');
          json.body.albums.should.include(oneAlbum);
        })
        .then(() => done());
    });
  });
});

describe('/albums/id POST', () => {
  beforeEach(() => {
    nock(albumListUrl)
      .get('/2')
      .reply(200, albumTwo);
  });

  it('should be successful', done => {
    testUser.successfulLogin.then(res => {
      return chai
        .request(server)
        .post('/albums/2')
        .set(sessionManager.HEADER_NAME, res.headers[sessionManager.HEADER_NAME])
        .then(json => {
          json.should.have.status(200);
          return user.getByEmail('julian.molina@wolox.com.ar').then(u => {
            return album.getOne(u.id, albumTwo.id).then(exist => {
              const success = !!exist;
              success.should.eqls(true);
            });
          });
        })
        .then(() => done());
    });
  });

  it('should fail because the album has already been purchased', done => {
    testUser.successfulLogin.then(res => {
      return chai
        .request(server)
        .post('/albums/2')
        .set(sessionManager.HEADER_NAME, res.headers[sessionManager.HEADER_NAME])
        .then(json => {
          testUser.successfulLogin.then(res2 => {
            return chai
              .request(server)
              .post('/albums/2')
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
  });
});
