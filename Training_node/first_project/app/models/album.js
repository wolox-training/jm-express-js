'use strict';

const errors = require('../errors'),
  logger = require('../logger');

module.exports = (sequelize, DataTypes) => {
  const album = sequelize.define(
    'album',
    {
      idAlbum: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        field: 'id'
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        field: 'user_id'
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    {
      paranoid: true,
      underscored: true
    }
  );
  album.createModel = newAlbum => {
    return album.create(newAlbum).catch(err => {
      throw errors.databaseError(err.message);
    });
  };
  album.getOne = (user, id) => {
    return album.findOne({ where: { idAlbum: id, userId: user } }).catch(err => {
      throw errors.databaseError(err.detail);
    });
  };
  album.getByUser = userId => {
    return album.findAll({ where: userId }).catch(err => {
      logger.info(err);
      throw errors.databaseError(err.detail);
    });
  };
  album.getByAlbum = id => {
    return album.findAll({ where: id }).catch(err => {
      throw errors.databaseError(err.detail);
    });
  };
  album.associate = function(models) {};
  return album;
};
