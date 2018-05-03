
'use strict';

const bcrypt = require('bcryptjs'),
  User = require('../models').user,
  errors = require('../errors');

exports.create = (req, res, next) => {
    const user = req.body
      ? {
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          username: req.body.username,
          password: req.body.password,
          email: req.body.email
        }
      : {};

    bcrypt
      .hash(user.password, saltRounds)
      .then(hash => {
        user.password = hash;

        User.createModel(user)
          .then(u => {
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
