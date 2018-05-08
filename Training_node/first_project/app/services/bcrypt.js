const bcrypt = require('bcryptjs');

exports.getHash = (password, saltRounds) => bcrypt.hash(password, saltRounds);
