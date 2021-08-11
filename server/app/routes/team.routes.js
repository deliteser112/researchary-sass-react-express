const controller = require('../controllers/team.controller');

module.exports = (app) => {
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Headers', 'x-access-token, Origin, Content-Type, Accept');
    next();
  });

  // -----------------------------------------------------------------------------------

  app.get('/api/team/all-teams', controller.getAllTeams);

  // -----------------------------------------------------------------------------------
  app.post('/api/team/upload-logo', controller.uploadFiles);
  app.post('/api/team/create-team', controller.createTeam);
  app.post('/api/team/update-team', controller.updateTeam);
};
