'use strict';
module.exports = (sequelize, DataTypes) => {
  var album_for_user = sequelize.define('album_for_user', {
    id_album: {
      type: Sequelize.INTEGER
    },
    id_user: {
      type: Sequelize.INTEGER
    }
  },{
    paranoid: true,
    underscored: true
  });
  album_for_user.associate = function(models) {
    // associations can be defined here
  };
  return album_for_user;
};
