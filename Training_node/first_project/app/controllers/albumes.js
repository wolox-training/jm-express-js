const errors = require('../errors'),
  request = require('request'),
  logger = require('../logger');

exports.getAll = (req, res, next) => {
  return request('https://jsonplaceholder.typicode.com/albums', function(error, response, body) {
    if (!error && response.statusCode === 200) {
      const info = JSON.parse(body);
      // do more stuff
      res.send({ albumes: info });
    }
  });
};
