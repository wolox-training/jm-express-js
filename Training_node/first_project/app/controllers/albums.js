const errors = require('../errors'),
  request = require('request'),
  logger = require('../logger'),
  config = require('../../config');

exports.getAll = (req, res, next) => {
  const url = `${config.common.urlRequests.base}${config.common.urlRequests.albumList}`;
  return request(url, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      const info = JSON.parse(body);
      res.send({ albums: info });
      res.status(200);
      res.end();
    } else {
      next(errors.defaultError(error));
    }
  });
};
