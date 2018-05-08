'use strict';

const User = require('../models/').user,
  validator = require('validator'),
  bcrypt = require('bcryptjs'),
  errors = require('../errors'),
  logger = require('../logger');

const validate = user => {

  if (!user.firstName || !user.lastName || !user.password || !user.email) throw errors.requiredFields;
};
const validateRestrictions = (email, password) => {
  if (!(validator.isEmail(email) && validator.contains(email, '@wolox.com.ar'))) {
    throw errors.emailInvalid;
  } else {
    if (!(validator.isAlphanumeric(password) && password.length > 8)) {
      throw errors.passwordInvalid;
    }
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
  validate(user);
  validateRestrictions(user.email, user.password);
  User.getByEmail(user.email).then(exist => {
    if (!exist) {
      bcrypt
        .hash(user.password, saltRounds)
        .then(hash => {
          user.password = hash;
          User.createModel(user)
            .then(u => {
              logger.info(user.username);
              res.status(200);
              res.end();
            })
            .catch(err => {
              next(err);
            });
        })
        .catch(err => {
          next(errors.defaultError(err));
        });
    } else {
      throw errors.existsUser;
    }
  });
};
