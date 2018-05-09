'use strict';

const errors = require('../errors');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'user',
    {
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'first_name'
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'last_name'
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    {
      paranoid: true,
      underscored: true
    }
  );
  User.createModel = user => {
    return User.create(user).catch(err => {
      throw errors.databaseError(err.message);
    });
  };
  User.getOne = email => {
    return User.findOne({ where: email }).catch(err => {
      throw errors.databaseError(err.detail);
    });
  };
  User.getByEmail = email => {
    return User.getOne({ email });
  };
  User.associate = function(models) {};
  return User;
};
