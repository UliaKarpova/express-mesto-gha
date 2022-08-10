const User = require('../models/user');

const uncorrectDataErrorMessage = 'Переданы некорректные данные';
const notFoundErrorMessage = 'Пользователь не найден';
const errorMessage = 'Произошла ошибка';

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({
    name, about, avatar, runValidators: true,
  })
    .then((user) => {
      res.status(200).send({ user }).end();
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: uncorrectDataErrorMessage });
        return;
      }
      res.status(500).send({ message: errorMessage });
    });
};

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => res.status(500).send({ message: errorMessage }));
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        res.status(404).send({ message: notFoundErrorMessage });
        return;
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: uncorrectDataErrorMessage });
        return;
      }
      res.status(500).send({ message: errorMessage });
    });
};

module.exports.updateUserInfo = (req, res) => {
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
        res.status(400).send({ message: uncorrectDataErrorMessage });
        return;
      }
      res.status(500).send({ message: errorMessage });
    });
};

module.exports.updateUserAvatar = (req, res) => {
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
        res.status(400).send({ message: uncorrectDataErrorMessage });
        return;
      }
      res.status(500).send({ message: errorMessage });
    });
};
