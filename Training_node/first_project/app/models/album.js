'use strict';
module.exports = (sequelize, DataTypes) => {
  var album = sequelize.define('album',{
    idAlbum: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'id_album'
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  },
  {
    paranoid: true,
    underscored: true
  });
  album.associate = function(models) {
    album.hasMany(album_for_users, {as: 'idAlbum'});
  };
  return album;
};
