const internalError = (message, internalCode) => ({
  message,
  internalCode
});

exports.DEFAULT_ERROR = 'default_error';
exports.defaultError = message => internalError(message, exports.DEFAULT_ERROR);

exports.DATABASE_ERROR = 'database_error';
exports.databaseError = message => ({
  message,
  internalCode: exports.DATABASE_ERROR
});
exports.EXISTS_USER = 'exists_user';
exports.existsUser = {
  message: 'A user already exists with this email',
  internalCode: exports.EXISTS_USER
};
