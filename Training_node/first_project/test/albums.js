const chai = require('chai'),
  dictum = require('dictum.js'),
  server = require('./../app'),
  nock = require('nock'),
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
  };

nock(albumListUrl)
  .get('')
  .reply(200, oneAlbum);

describe('/albums GET', () => {
  it('', done => {
    testUser.successfulLogin.then(res => {
      return chai
        .request(server)
        .get('/albums')
        .set(sessionManager.HEADER_NAME, res.headers[sessionManager.HEADER_NAME])
        .then(json => {
          logger.info(json.body);
          json.should.have.status(200);
          json.body.should.have.property('albums');
          json.body.albums.should.include(oneAlbum);
        })
        .then(() => done());
    });
  });
});
