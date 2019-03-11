'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Posts', 'flairId', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: "Flairs",
        key: "id",
        as: "flairId"
      }
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Posts', 'flairId');
  }
};
