const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/NotFoundError');
const UncorrectDataError = require('../errors/UncorrectDataError');
const UncorrectEmailOrPasswordError = require('../errors/UncorrectEmailOrPasswordError');
const UserAlreadyExistsError = require('../errors/UserAlreadyExistsError');

const uncorrectDataErrorMessage = 'Переданы некорректные данные';
const notFoundErrorMessage = 'Пользователь не найден';
const uncorrectEmailOrPasswordMessage = 'Неправильные почта или пароль';
const userAlreadyExistsMessage = 'Пользователь с таким email уже существует';

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new UncorrectDataError(uncorrectDataErrorMessage);
  }
  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'c0a184a583f9db94dffbe4b3eff23c23e4ed8272b2ea41de86a92ba4bf9213df');
      res.cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
      }).end();
    })
    .catch(() => {
      throw new UncorrectEmailOrPasswordError(uncorrectEmailOrPasswordMessage);
    })
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  if (!email || !password) {
    throw new UncorrectDataError(uncorrectDataErrorMessage);
  }
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user) => {
      res.status(200).send({ user }).end();
    })
    .catch((err) => {
      if (err.code === 11000) {
        throw new UserAlreadyExistsError(userAlreadyExistsMessage);
      }
      if (err.name === 'ValidationError') {
        throw new UncorrectDataError(uncorrectDataErrorMessage);
      }
    })
    .catch(next);
};

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(next);
};

module.exports.getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError(notFoundErrorMessage);
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new UncorrectDataError(uncorrectDataErrorMessage);
      }
    })
    .catch(next);
};

module.exports.updateUserInfo = (req, res, next) => {
  User.findByIdAndUpdate(req.user._id, {
    name: req.body.name,
    about: req.body.about,
  }, {
    new: true,
    runValidators: true,
  })
    .then((user) => res.send({ user }))
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        throw new UncorrectDataError(uncorrectDataErrorMessage);
      }
    })
    .catch(next);
};

module.exports.updateUserAvatar = (req, res, next) => {
  User.findByIdAndUpdate(req.user._id, {
    avatar: req.body.avatar,
  }, {
    new: true,
    runValidators: true,
  })
    .then((avatar) => {
      res.send({ avatar });
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        throw new UncorrectDataError(uncorrectDataErrorMessage);
      }
    })
    .catch(next);
};

module.exports.getUserInfo = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError(notFoundErrorMessage);
      }
      res.send(user);
    })
    .catch(() => {
    })
    .catch(next);
};
