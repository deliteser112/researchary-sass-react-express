module.exports = (sequelize, Sequelize) => {
  const Conference = sequelize.define('conferences', {
    name: {
      type: Sequelize.STRING
    },
    logoURL: {
      type: Sequelize.STRING
    },
    description: {
      type: Sequelize.TEXT
    },
    publisher: {
      type: Sequelize.STRING
    },
    abbreviation: {
      type: Sequelize.STRING
    },
    score: {
      type: Sequelize.INTEGER
    },
    toSubmit: {
      type: Sequelize.INTEGER,
      defaultValue: 0
    },
    underReview: {
      type: Sequelize.INTEGER,
      defaultValue: 0
    },
    published: {
      type: Sequelize.INTEGER,
      defaultValue: 0
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

  return Conference;
};
