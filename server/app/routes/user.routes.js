const controller = require('../controllers/user.controller');

module.exports = (app) => {
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Headers', 'x-access-token, Origin, Content-Type, Accept');
    next();
  });

  app.get('/api/user/users', controller.getUserList);
  app.get('/api/user/profile', controller.getProfile);

  // -----------------------------------------------------------------------------------

  app.post('/api/user/updateProfile', controller.updateProfile);
  app.post('/api/user/uploadAvatar', controller.uploadAvatar);
};
