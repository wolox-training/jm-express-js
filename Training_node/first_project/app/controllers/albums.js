const errors = require('../errors'),
  logger = require('../logger'),
  config = require('../../config'),
  request = require('../services/request');

exports.getAll = (req, res, next) => {
  const url = `${config.common.urlRequests.base}${config.common.urlRequests.albumList}`;
  return request
    .execute(url)
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
  return executeRequest(urlId)
    .then(oneAlbum => {
      //create a album
    })
    .catch(err => {
      next(err);
    });
};
