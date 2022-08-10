const cardRoutes = require('express').Router();
const {
  createCard, getCards, deleteCardById, likeCard, dislikeCard,
} = require('../controllers/cardsController');

cardRoutes.post('/cards', createCard);

cardRoutes.get('/cards', getCards);

cardRoutes.delete('/cards/:cardId', deleteCardById);

cardRoutes.put('/cards/:cardId/likes', likeCard);

cardRoutes.delete('/cards/:cardId/likes', dislikeCard);

module.exports = cardRoutes;
