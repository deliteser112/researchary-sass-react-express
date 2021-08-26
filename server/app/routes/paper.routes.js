const controller = require('../controllers/paper.controller');

module.exports = (app) => {
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Headers', 'x-access-token, Origin, Content-Type, Accept');
    next();
  });

  // -----------------------------------------------------------------------------------

  app.get('/api/paper/recommand-topics', controller.getRecommandTopics);
  app.get('/api/paper/topics', controller.getTopics);
  app.get('/api/paper/all-papers', controller.getAllPapers);
  app.get('/api/paper/published-papers', controller.getPublishedPapers);
  app.get('/api/paper/paper-timelines', controller.getTimelines);

  // -----------------------------------------------------------------------------------
  app.post('/api/paper/create-paper', controller.createPaper);
  app.post('/api/paper/update-paper', controller.updatePaper);
  app.post('/api/paper/update-status', controller.updateStatus);

  app.post('/api/paper/update-authors', controller.setAuthors);

  // -----------------------------------------------------------------------------------
  app.post('/api/paper/delete-paper', controller.deletePaper);
};
