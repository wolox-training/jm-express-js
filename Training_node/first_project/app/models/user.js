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
      },
      admin: {
        type: DataTypes.BOOLEAN
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
  User.getCountUsers = () => {
    return User.count().catch(err => {
      throw errors.databaseError(err.detail);
    });
  };
  User.getUsers = (count, off = 0) => {
    return User.findAll({ limit: count, offset: off }).catch(err => {
      throw errors.databaseError(err.detail);
    });
  };
  User.setAdmin = idUser => {
    return User.update({ admin: true }, { where: { id: idUser } }).catch(err => {
      throw errors.databaseError(err.detail);
    });
  };
  User.associate = function(models) {};
  return User;
};
