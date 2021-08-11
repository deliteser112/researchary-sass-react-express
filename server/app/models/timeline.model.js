module.exports = (sequelize, Sequelize) => {
  const Timeline = sequelize.define('timelines', {
    name: {
      type: Sequelize.STRING
    },
    photoURL: {
      type: Sequelize.STRING
    },
    eventText: {
      type: Sequelize.STRING
    },
    eventContent: {
      type: Sequelize.STRING
    },
    date: {
      type: Sequelize.STRING
    },
    isStatus: {
      type: Sequelize.INTEGER
    },
    status: {
      type: Sequelize.STRING
    },
    userId: {
      type: Sequelize.INTEGER
    },
    paperId: {
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

  return Timeline;
};
