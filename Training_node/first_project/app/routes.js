const users = require('./controllers/users'),
  albums = require('./controllers/albums'),
  auth = require('./middlewares/auth');

exports.init = app => {
  // Users
  app.post('/users', [], users.createRegular);
  app.post('/users/sessions', [], users.login);
  app.post('/users/sessions/invalidate_all', [auth.secureRegular], users.invalidateAll);
  app.get('/users', [auth.secureRegular], users.getAll);
  app.get('/users/:user_id/albums', [auth.secureRegular], users.getAllAlbums);
  app.get('/users/albums/:id/photos', [auth.secureRegular], users.getPhotos);
  app.post('/admin/users', [auth.secureAdmin], users.createAdmin);
  app.get('/albums', [auth.secureRegular], albums.getAll);
  app.post('/albums/:id', [auth.secureRegular], albums.getById);
};
