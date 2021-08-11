module.exports = (sequelize, Sequelize) => {
  const File = sequelize.define('files', {
    name: {
      type: Sequelize.STRING
    },
    type: {
      type: Sequelize.STRING
    },
    size: {
      type: Sequelize.INTEGER
    },
    path: {
      type: Sequelize.STRING
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

  return File;
};
