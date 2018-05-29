const jwt = require('jwt-simple'),
  logger = require('./../../app/logger'),
  config = require('./../../config');

const SECRET = config.common.session.secret;

exports.HEADER_NAME = config.common.session.header_name;
exports.HEADER_EXPIRATION_NAME = config.common.session.expiration_name;
exports.HEADER_CREATION_NAME = config.common.session.creation_name;

exports.encode = toEncode => {
  return jwt.encode(toEncode, SECRET);
};

exports.decode = toDecode => {
  return jwt.decode(toDecode, SECRET);
};
