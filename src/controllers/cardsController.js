const Card = require('../models/card');

const uncorrectDataErrorMessage = 'Переданы некорректные данные';
const notFoundErrorMessage = 'Карточка не найдена';
const errorMessage = 'Произошла ошибка';

const uncorrectDataErrorStatus = 400;
const notFoundErrorStatus = 404;
const anotherErrorStatus = 500;

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      res.status(200).send({ card }).end();
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(uncorrectDataErrorStatus).send({ message: uncorrectDataErrorMessage });
        return;
      }
      res.status(anotherErrorStatus).send({ message: errorMessage });
    });
};

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(() => res.status(anotherErrorStatus).send({ message: errorMessage }));
};

module.exports.deleteCardById = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        res.status(notFoundErrorStatus).send({ message: notFoundErrorMessage });
        return;
      }
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(uncorrectDataErrorStatus).send({ message: uncorrectDataErrorMessage });
        return;
      }
      res.status(anotherErrorStatus).send({ message: errorMessage });
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    {
      new: true,
    },
  )
    .then((card) => {
      if (!card) {
        res.status(notFoundErrorStatus).send({ message: notFoundErrorMessage });
        return;
      }
      res.send({ card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(uncorrectDataErrorStatus).send({ message: uncorrectDataErrorMessage });
        return;
      }
      res.status(anotherErrorStatus).send({ message: errorMessage });
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    {
      new: true,
    },
  )
    .then((card) => {
      if (!card) {
        res.status(notFoundErrorStatus).send({ message: notFoundErrorMessage });
        return;
      }
      res.send({ card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(uncorrectDataErrorStatus).send({ message: uncorrectDataErrorMessage });
        return;
      }
      res.status(anotherErrorStatus).send({ message: errorMessage });
    });
};
