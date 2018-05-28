const sessionManager = require('./../services/sessionManager'),
  User = require('../models').user,
  config = require('../../config'),
  moment = require('moment'),
  logger = require('../logger');

const isValid = (creation, expiration) => {
  return !(moment().diff(expiration, config.common.session.unit) > 0);
};
const auth = (req, res, next, isAdmin = false) => {
  const authHeader = req.headers[sessionManager.HEADER_NAME];
  if (authHeader) {
    const token = sessionManager.decode(authHeader);
    if (isValid(token.creation, token.expiration)) {
      return User.getByEmail(token.email)
        .then(u => {
          if (u) {
            if (isAdmin) {
              if (u.admin) {
                req.user = u;
                next();
              } else {
                res.status(401);
                res.end();
              }
            } else {
              req.user = u;
              next();
            }
          } else {
            res.status(401);
            res.end();
          }
        })
        .catch(err => logger.error(err));
    } else {
      res.status(401);
      res.end();
    }
  } else {
    res.status(401);
    res.end();
  }
};

exports.secureRegular = (req, res, next) => {
  auth(req, res, next);
};

exports.secureAdmin = (req, res, next) => {
  auth(req, res, next, true);
};
