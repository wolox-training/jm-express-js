const User = require('../models/').user,
  validator = require('validator'),
  Hash = require('../services/bcrypt'),
  errors = require('../errors'),
  logger = require('../logger');

const validateRestrictions = (email, password) => {
  if (!(validator.isEmail(email) && validator.contains(email, '@wolox.com.ar'))) {
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
          User.getByEmail(user.email).then(exist => {
            if (!exist) {
              User.createModel(user)
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
