const Card = require('../models/card');
const UncorrectDataError = require('../errors/UncorrectDataError');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenDeleteCardError = require('../errors/ForbiddenDeleteCardError');

const uncorrectDataErrorMessage = 'Переданы некорректные данные';
const notFoundErrorMessage = 'Карточка не найдена';
const forbiddenDeleteCardErrorMessage = 'Можно удалять только свою карточку';

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      res.status(200).send({ card }).end();
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new UncorrectDataError(uncorrectDataErrorMessage);
      }
    })
    .catch(next);
};

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(next);
};

module.exports.deleteCardById = (req, res, next) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError(notFoundErrorMessage);
      }
      if (card.owner !== req.user._id) {
        throw new ForbiddenDeleteCardError(forbiddenDeleteCardErrorMessage);
      }
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new UncorrectDataError(uncorrectDataErrorMessage);
      }
    })
    .catch(next);
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    {
      new: true,
    },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError(notFoundErrorMessage);
      }
      res.send({ card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new UncorrectDataError(uncorrectDataErrorMessage);
      }
    })
    .catch(next);
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    {
      new: true,
    },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError(notFoundErrorMessage);
      }
      res.send({ card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new UncorrectDataError(uncorrectDataErrorMessage);
      }
    })
    .catch(next);
};
