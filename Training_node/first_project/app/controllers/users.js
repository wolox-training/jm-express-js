const User = require('../models/').user,
  validator = require('validator'),
  Hash = require('../services/bcrypt'),
  errors = require('../errors'),
  sessionManager = require('./../services/sessionManager'),
  logger = require('../logger');

const validateEmail = email => {
  return validator.isEmail(email) && validator.contains(email, '@wolox.com.ar');
};
const validatePassword = password => {
  return validator.isAlphanumeric(password) && password.length > 8;
};

const validateRestrictions = (email, password) => {
  if (!validateEmail(email)) {
    return { success: false, reason: 'The email must be valid and pertain Wolox' };
  } else {
    if (!validatePassword(password)) {
      return { success: false, reason: 'The password must be alphanumeric and length greather than 8' };
    } else {
      return { success: true };
    }
  }
};

const validateEmailPassword = (email, password) => {
  if (email && password) {
    return validateRestrictions(email, password);
  }
  return { success: false, reason: 'The fields email and password are required' };
};

const validate = (firstName, lastName, password, email) => {
  return !firstName || !lastName || !password || !email
    ? { success: false, reason: 'The fields first name, last name, password and email are required' }
    : { success: true };
};

const createModel = (user, res, next) => {
  return User.createModel(user)
    .then(u => {
      res.send(user.email);
      res.status(200);
      res.end();
    })
    .catch(err => {
      next(err);
    });
};
const setAdmin = (user, res, next) => {
  return User.setAdmin(user.id)
    .then(u => {
      res.send(user.email);
      res.status(200);
      res.end();
    })
    .catch(err => {
      next(err);
    });
};
const create = (req, res, next, admin = false) => {
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
            if (admin) {
              user.admin = true;
              return exist ? setAdmin(exist, res, next) : createModel(user, res, next);
            } else {
              if (!exist) {
                return createModel(user, res, next);
              } else {
                next(errors.existsUser);
              }
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

exports.login = (req, res, next) => {
  const user = req.body
    ? {
        email: req.body.email,
        password: req.body.password
      }
    : {};
  const result = validateEmailPassword(user.email, user.password);
  if (result.success) {
    return User.getByEmail(user.email).then(u => {
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
    next(errors.defaultError(result.reason));
  }
};
exports.createAdmin = (req, res, next) => {
  return create(req, res, next, true);
};

exports.createRegular = (req, res, next) => {
  return create(req, res, next);
};

exports.getAll = (req, res, next) => {
  if (req.query.limit && req.query.page) {
    const limitInt = parseInt(req.query.limit);
    const pageInt = parseInt(req.query.page);
    return User.getUsers(limitInt, pageInt)
      .then(u => {
        res.send({ users: u });
        res.status(200);
        res.end();
      })
      .catch(err => {
        next(err);
      });
  } else {
    next(errors.defaultError('The fields page and limit are required'));
  }
};
