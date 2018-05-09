// exports.execute = () => {
//   // This function should create data for testing and return a promise
// };

const bcrypt = require('bcryptjs'),
  User = require('../app/models').user;

exports.execute = () => {
  return bcrypt
    .hash('hola12345', 10)
    .then(hash => {
      const data = [];
      data.push(
        User.create({
          firstName: 'firstName1',
          lastName: 'lastName1',
          email: 'email1@wolox.com.ar',
          password: hash
        })
      );

      return Promise.all(data);
    })
    .catch(bcryptErr => {
      throw bcryptErr;
    });
};
