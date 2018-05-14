const Hash = require('../app/services/bcrypt'),
  User = require('../app/models').user;

exports.execute = () => {
  return Hash.getHash('hola12345', 10)
    .then(hash => {
      const data = [];
      data.push(
        User.create({
          firstName: 'julian',
          lastName: 'molina',
          email: 'julian.molina@wolox.com.ar',
          password: hash
        })
      );
      return Promise.all(data);
    })
    .catch(err => {
      throw err;
    });
};
