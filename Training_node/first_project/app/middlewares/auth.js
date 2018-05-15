const sessionManager = require('./../services/sessionManager'),
  User = require('../models').user;

exports.secure = (req, res, next) => {
  const auth = req.headers[sessionManager.HEADER_NAME];

  if (auth) {
    const user = sessionManager.decode(auth);
    return User.getByEmail(user)
      .then(u => {
        if (u) {
          req.user = u;
          next();
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
