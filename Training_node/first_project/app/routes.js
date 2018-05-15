const users = require('./controllers/users'),
  auth = require('./middlewares/auth');

exports.init = app => {
  // Users
  app.post('/users', [], users.create);
  app.post('/users/sessions', [], users.login);
  app.get('/users', [auth.secure], users.getAll);
  // app.post('/admin/users', [auth.secure], users.createAdmin);
};
