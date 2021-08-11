module.exports = (sequelize, Sequelize) => {
  const Task = sequelize.define('tasks', {
    title: {
      type: Sequelize.STRING
    },
    createdBy: {
      type: Sequelize.INTEGER
    },
    assignedTo: {
      type: Sequelize.INTEGER
    },
    status: {
      type: Sequelize.INTEGER
    },
    dueDate: {
      type: Sequelize.STRING
    },
    details: {
      type: Sequelize.TEXT
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

  return Task;
};
