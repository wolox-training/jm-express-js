const sessionManager = require('./../services/sessionManager'),
  User = require('../models').user;

const authAdmin = (req, res, next, isAdmin = false) => {
  const auth = req.headers[sessionManager.HEADER_NAME];
  if (auth) {
    const user = sessionManager.decode(auth);
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
      .catch(err => console.log(err));
  } else {
    res.status(401);
    res.end();
  }
};

exports.secure = (req, res, next) => {
  authAdmin(req, res, next);
};

exports.secureAdmin = (req, res, next) => {
  authAdmin(req, res, next, true);
};
