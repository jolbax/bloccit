'use strict';
module.exports = (sequelize, DataTypes) => {
  const Vote = sequelize.define('Vote', {
    value: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isIn: [[-1, 1]]
      }
    },
    postId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  }, {});
  Vote.associate = function(models) {
    Vote.belongsTo(models.User, {
      foreignKey: "userId",
      onDelete: "CASCADE"
    });
    Vote.belongsTo(models.Post, {
      foreignKey: "postId",
      onDelete: "CASCADE"
    })
  };
  return Vote;
};