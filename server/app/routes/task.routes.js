const controller = require('../controllers/task.controller');

module.exports = (app) => {
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Headers', 'x-access-token, Origin, Content-Type, Accept');
    next();
  });

  // -----------------------------------------------------------------------------------

  app.get('/api/paper/paper-tasks', controller.getPaperTasks);

  // -----------------------------------------------------------------------------------
  app.post('/api/paper/create-task', controller.createTask);
  app.post('/api/paper/update-task', controller.updateTask);
};
