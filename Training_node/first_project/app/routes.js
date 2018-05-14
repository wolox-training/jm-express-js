const users = require('./controllers/users');

exports.init = app => {
  // Users
  app.post('/users', [], users.create);
  app.post('/users/sessions', [], users.login);
};
