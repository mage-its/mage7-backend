const passRegex = /^[0-9a-fA-F]{24}$/;
const numRegex = /\d/;
const letterRegex = /[a-zA-Z]/;

const objectId = (value, helpers) => {
  if (!value.match(passRegex)) {
    return helpers.message('"{{#label}}" must be a valid mongo id');
  }
  return value;
};

const password = (value, helpers) => {
  if (value.length < 8) {
    return helpers.message('password must be at least 8 characters');
  }
  if (!value.match(numRegex) || !value.match(letterRegex)) {
    return helpers.message('password must contain at least 1 letter and 1 number');
  }
  return value;
};

module.exports = {
  objectId,
  password,
};
