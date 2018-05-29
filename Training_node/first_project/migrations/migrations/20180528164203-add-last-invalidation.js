'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('users', 'last_invalidate', { type: Sequelize.STRING });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('users', 'last_invalidate');
  }
};
