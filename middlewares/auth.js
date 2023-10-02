const jwt = require('jsonwebtoken');
const UnathorizedError = require('../errors/Unathorized');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  const error = new UnathorizedError('Необходимо авторизоваться');

  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(error);
  }

  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, 'secret-key');
  } catch (e) {
    next(error);
  }

  req.user = payload;

  next();
};
