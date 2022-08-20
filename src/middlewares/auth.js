const jwt = require('jsonwebtoken');

const NeedAutarizationError = require('../errors/NeedAutarizationError');

const needAutarizationErrorMessage = 'Необходима авторизация';

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    throw new NeedAutarizationError(needAutarizationErrorMessage);
  }
  let payload;
  try {
    payload = jwt.verify(token, 'c0a184a583f9db94dffbe4b3eff23c23e4ed8272b2ea41de86a92ba4bf9213df');
  } catch (err) {
    throw new NeedAutarizationError(needAutarizationErrorMessage);
  }
  req.user = payload;
  /* console.log(req.user._id); */
  next();
};
