const controller = require('../controllers/conference.controller');

module.exports = (app) => {
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Headers', 'x-access-token, Origin, Content-Type, Accept');
    next();
  });

  // -----------------------------------------------------------------------------------

  app.get('/api/conference/all-conferences', controller.getAllConferences);
  app.get('/api/conference/topics-by-team', controller.getConferenceTopicsByTeam);
  app.get('/api/conference/topics-by-user', controller.getUserTopics);

  // -----------------------------------------------------------------------------------
  app.post('/api/conference/upload-logo', controller.uploadFiles);
  app.post('/api/conference/create-conference', controller.createConference);
  app.post('/api/conference/update-conference', controller.updateConference);
};
