const cardRoutes = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  createCard, getCards, deleteCardById, likeCard, dislikeCard,
} = require('../controllers/cardsController');

cardRoutes.post('/cards', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().pattern(/(?:https?):\/\/(\w+:?\w*)?(\S+)(:\d+)?(\.\w{2,3})(\/|\/([\w#!:.?+=&%!\-/]))?/).required(),
  }),
}), createCard);

cardRoutes.get('/cards', getCards);

cardRoutes.delete('/cards/:cardId', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24).hex(),
  }),
}), deleteCardById);

cardRoutes.put('/cards/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24).hex(),
  }),
}), likeCard);

cardRoutes.delete('/cards/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24).hex(),
  }),
}), dislikeCard);

module.exports = cardRoutes;
