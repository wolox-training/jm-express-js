const errors = require('../errors'),
  request = require('request'),
  logger = require('../logger'),
  config = require('../../config');

const executeRequest = url => {
  return new Promise((resolve, reject) => {
    request(url, function(error, response, body) {
      if (!error && response.statusCode === 200) {
        resolve(JSON.parse(body));
      } else {
        reject(errors.defaultError(error));
      }
    });
  });
};
exports.getAll = (req, res, next) => {
  const url = `${config.common.urlRequests.base}${config.common.urlRequests.albumList}`;
  return executeRequest(url)
    .then(allAlbums => {
      logger.info(json);
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
