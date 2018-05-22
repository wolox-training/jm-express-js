const errors = require('../errors'),
  request = require('request'),
  logger = require('../logger'),
  config = require('../../config');

exports.executeRequest = url => {
  return new Promise((resolve, reject) => {
    request(url, { json: true }, function(error, response, body) {
      if (!error && response.statusCode === 200) {
        resolve(body);
      } else {
        reject(errors.defaultError(error));
      }
    });
  });
};
