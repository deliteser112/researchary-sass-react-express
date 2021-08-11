const controller = require('../controllers/file.controller');

module.exports = (app) => {
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Headers', 'x-access-token, Origin, Content-Type, Accept');
    next();
  });

  // -----------------------------------------------------------------------------------

  app.get('/api/paper/paper-files', controller.getPaperFiles);

  // -----------------------------------------------------------------------------------
  app.post('/api/paper/upload-files', controller.uploadFiles);
  // app.post('/api/paper/update-task', controller.updateTask);
};
