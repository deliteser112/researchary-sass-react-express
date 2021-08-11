module.exports = (sequelize, Sequelize) => {
  const Topic = sequelize.define('topics', {
    name: {
      type: Sequelize.STRING
    },
    isActive: {
      type: Sequelize.INTEGER
    },
    createdAt: {
      type: 'TIMESTAMP',
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      allowNull: false
    },
    updatedAt: {
      type: 'TIMESTAMP',
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      allowNull: false
    }
  });

  return Topic;
};
