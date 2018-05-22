const sessionManager = require('./../services/sessionManager'),
  User = require('../models').user,
  logger = require('../logger');

const auth = (req, res, next, isAdmin = false) => {
  const authHeader = req.headers[sessionManager.HEADER_NAME];
  if (authHeader) {
    const user = sessionManager.decode(authHeader);
    return User.getByEmail(user)
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
};

exports.secureRegular = (req, res, next) => {
  auth(req, res, next);
};

exports.secureAdmin = (req, res, next) => {
  auth(req, res, next, true);
};
