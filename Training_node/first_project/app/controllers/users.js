const User = require('../models/').user,
  validator = require('validator'),
  Hash = require('../services/bcrypt'),
  errors = require('../errors'),
  sessionManager = require('./../services/sessionManager'),
  logger = require('../logger');

const validateEmail = email => {
  return !!(validator.isEmail(email) && validator.contains(email, '@wolox.com.ar'));
};
const validateRestrictions = (email, password) => {
  if (!validateEmail(email)) {
    return { success: false, reason: 'The email must be valid and pertain Wolox' };
  } else {
    if (!(validator.isAlphanumeric(password) && password.length > 8)) {
      return { success: false, reason: 'The password must be alphanumeric and length greather than 8' };
    } else {
      return { success: true };
    }
  }
};

const validate = (firstName, lastName, password, email) => {
  return !firstName || !lastName || !password || !email
    ? { success: false, reason: 'The fields first name, last name, password and email are required' }
    : { success: true };
};

exports.login = (req, res, next) => {
  const user = req.body
    ? {
        email: req.body.email,
        password: req.body.password
      }
    : {};
  if (user.email && user.password) {
    if (validateEmail(user.email)) {
      User.getByEmail(user.email).then(u => {
        if (u) {
          return Hash.passwordsEquals(user.password, u.password).then(isValid => {
            if (isValid) {
              const auth = sessionManager.encode(u.email);
              res.status(200);
              res.set(sessionManager.HEADER_NAME, auth);
              res.send(u);
            } else {
              next(errors.incorrect_user_password);
            }
          });
        } else {
          next(errors.incorrect_user_password);
        }
      });
    } else {
      next(errors.defaultError('The email must be valid and pertain Wolox'));
    }
  } else {
    next(errors.defaultError('The fields email and password are required'));
  }
};

exports.create = (req, res, next) => {
  const saltRounds = 10;
  const user = req.body
    ? {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        password: req.body.password,
        email: req.body.email
      }
    : {};
  const validation = validate(user.firstName, user.lastName, user.password, user.email);
  if (validation.success) {
    const checkRestrictions = validateRestrictions(user.email, user.password);
    if (checkRestrictions.success) {
      return Hash.getHash(user.password, saltRounds)
        .then(newPassword => {
          user.password = newPassword;
          return User.getByEmail(user.email).then(exist => {
            if (!exist) {
              return User.createModel(user)
                .then(u => {
                  res.send(user.email);
                  res.status(200);
                  res.end();
                })
                .catch(err => {
                  next(err);
                });
            } else {
              next(errors.existsUser);
            }
          });
        })
        .catch(err => {
          next(errors.defaultError(err));
        });
    } else {
      next(errors.defaultError(checkRestrictions.reason));
    }
  } else {
    next(errors.defaultError(validation.reason));
  }
};

exports.getAll = (req, res, next) => {
  if (req.query.limit && req.query.page) {
    const limitInt = parseInt(req.query.limit);
    const pageInt = parseInt(req.query.page);
    if (pageInt === 1) {
      return User.getUsers(limitInt).then(u => {
        res.send({ users: u });
        res.status(200);
        res.end();
      });
    } else {
      return User.getCountUsers().then(count => {
        if (!(limitInt * pageInt > count)) {
          return User.getUsers(limitInt, limitInt * pageInt - 1).then(u => {
            res.send({ users: u });
            res.status(200);
            res.end();
          });
        } else {
          next(errors.defaultError('Page not found'));
        }
      });
    }
  } else {
    next(errors.defaultError('The fields page and limit are required'));
  }
};
