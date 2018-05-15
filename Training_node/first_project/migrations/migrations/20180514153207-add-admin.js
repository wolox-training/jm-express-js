'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('users', 'admin', { type: Sequelize.BOOLEAN });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('users', 'admin');
  }
};
