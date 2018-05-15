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
    return User.getOne({ email }).catch(err => {
      throw errors.databaseError(err.detail);
    });
  };
  User.getCountUsers = () => {
    return User.count().catch(err => {
      throw errors.databaseError(err.detail);
    });
  };
  User.getUsers = (count = 20, pageUser = 0) => {
    return User.getCountUsers().then(countUsers => {
      const pagedb = pageUser - 1;
      if (!(count * pagedb >= countUsers)) return User.findAll({ limit: count, offset: count * pagedb });
      else throw errors.defaultError('Page not found');
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
