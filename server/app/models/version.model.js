module.exports = (sequelize, Sequelize) => {
  const Version = sequelize.define('version', {
    year: {
      type: Sequelize.STRING
    },
    location: {
      type: Sequelize.STRING
    },
    city: {
      type: Sequelize.STRING
    },
    startDate: {
      type: Sequelize.STRING
    },
    endDate: {
      type: Sequelize.STRING
    },
    submissionDate: {
      type: Sequelize.STRING
    },
    conferenceSite: {
      type: Sequelize.STRING
    },
    submissionLink: {
      type: Sequelize.STRING
    },
    isOnline: {
      type: Sequelize.STRING
    },
    conferenceId: {
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

  return Version;
};
