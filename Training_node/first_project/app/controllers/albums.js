const errors = require('../errors'),
  logger = require('../logger'),
  config = require('../../config'),
  album = require('../models').album,
  User = require('../models').user,
  sessionManager = require('./../services/sessionManager'),
  albumService = require('../services/album');

exports.getAll = (req, res, next) => {
  const url = `${config.common.urlRequests.base}${config.common.urlRequests.albumList}`;
  return albumService
    .executeRequest(url)
    .then(allAlbums => {
      res.send({ albums: allAlbums });
      res.status(200);
      res.end();
    })
    .catch(err => {
      next(err);
    });
};

exports.getById = (req, res, next) => {
  const urlId = `${config.common.urlRequests.base}${req.url}`;
  const token = sessionManager.decode(req.headers.authorization);
  return User.getByEmail(token.email)
    .then(u => {
      return albumService.executeRequest(urlId).then(oneAlbum => {
        return album.getOne(u.id, oneAlbum.id).then(exist => {
          if (!exist) {
            album.create({ idAlbum: oneAlbum.id, userId: u.id, title: oneAlbum.title }).then(a => {
              res.send();
              res.status(200);
              res.end();
            });
          } else {
            next(errors.defaultError('This album has already been purchased'));
          }
        });
      });
    })
    .catch(err => {
      next(err);
    });
};
