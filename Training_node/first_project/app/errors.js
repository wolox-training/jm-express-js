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
exports.EMAIL_INVALID = 'email_invalid';
exports.emailInvalid = message => ({
  message,
  internalCode: exports.EMAIL_INVALID
});
exports.PASSWORD_INVALID = 'invalid_password';
exports.passwordInvalid = message => ({
  message,
  internalCode: exports.PASSWORD_INVALID
});
