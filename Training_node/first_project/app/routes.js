const users = require('./controllers/users'),
  auth = require('./middlewares/auth');

exports.init = app => {
  // Users
  app.post('/users', [], users.createRegular);
  app.post('/users/sessions', [], users.login);
  app.get('/users', [auth.secureRegular], users.getAll);
  app.post('/admin/users', [auth.secureAdmin], users.createAdmin);
};
