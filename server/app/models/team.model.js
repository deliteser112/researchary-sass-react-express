module.exports = (sequelize, Sequelize) => {
  const Team = sequelize.define('teams', {
    name: {
      type: Sequelize.STRING
    },
    logoURL: {
      type: Sequelize.STRING
    },
    description: {
      type: Sequelize.TEXT
    },
    affiliation: {
      type: Sequelize.STRING
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

  return Team;
};
