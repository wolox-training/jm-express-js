'use strict';

const User = require('../models/').user,
  validator = require('validator'),
  bcrypt = require('bcryptjs'),
  errors = require('../errors'),
  logger = require('../logger');

const validate = (email, password) => {
  if (!(validator.isEmail(email) && validator.contains(email, '@wolox.com.ar'))) {
    throw errors.emailInvalid('The email must be valid and pertain Wolox');
  } else {
    if (!(validator.isAlphanumeric(password) && password.length > 8)) {
      throw errors.passwordInvalid('The password must be alphanumeric and length greather than 8');
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
  try {
    validate(user.email, user.password);
  } catch (e) {
    return next(e);
  }
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
};
