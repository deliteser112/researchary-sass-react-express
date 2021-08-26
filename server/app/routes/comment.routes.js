const controller = require('../controllers/comment.controller');

module.exports = (app) => {
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Headers', 'x-access-token, Origin, Content-Type, Accept');
    next();
  });

  // -----------------------------------------------------------------------------------

  app.get('/api/paper/paper-comments', controller.getPaperComments);

  // -----------------------------------------------------------------------------------
  app.post('/api/paper/create-comment', controller.createComment);
};
