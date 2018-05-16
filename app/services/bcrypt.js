const bcrypt = require('bcryptjs');

exports.getHash = (password, saltRounds) => bcrypt.hash(password, saltRounds);
exports.passwordsEquals = (requestHash, dbHash) => bcrypt.compare(requestHash, dbHash);
