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
exports.emailInvalid = {
  message: 'The email must be valid and pertain Wolox',
  internalCode: exports.EMAIL_INVALID
};
exports.PASSWORD_INVALID = 'invalid_password';
exports.passwordInvalid = {
  message: 'The password must be alphanumeric and length greather than 8',
  internalCode: exports.PASSWORD_INVALID
};
exports.EXISTS_USER = 'exists_user';
exports.existsUser = {
  message: 'A user already exists with this email',
  internalCode: exports.EXISTS_USER
};
exports.REQUIRED_FIELDS = 'required_fields';
exports.requiredFields = {
  message: 'The fields first name, last name , email and password they are obligatory',
  internalCode: exports.REQUIRED_FIELDS
};
