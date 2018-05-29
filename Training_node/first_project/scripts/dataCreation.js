const Hash = require('../app/services/bcrypt'),
  album = require('../app/models').album,
  User = require('../app/models').user;

exports.execute = () => {
  return Hash.getHash('hola12345', 10)
    .then(hash => {
      const data = [];
      data.push(
        User.create({
          firstName: 'julian',
          lastName: 'sevilla',
          email: 'julian.sevilla@wolox.com.ar',
          password: hash
        })
      );
      data.push(
        User.create({
          firstName: 'pablo',
          lastName: 'cid',
          email: 'pablo.cid@wolox.com.ar',
          password: hash
        })
      );
      data.push(
        User.create({
          firstName: 'julian',
          lastName: 'molina',
          email: 'julian.molina@wolox.com.ar',
          admin: true,
          password: hash
        })
      );
      return Promise.all(data);
    })
    .catch(err => {
      throw err;
    });
};
