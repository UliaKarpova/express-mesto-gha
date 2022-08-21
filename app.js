const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { celebrate, Joi } = require('celebrate');
const { errors } = require('celebrate');
const { login, createUser } = require('./src/controllers/usersController');

const auth = require('./src/middlewares/auth');

const userRoutes = require('./src/routes/usersRoutes');
const cardRoutes = require('./src/routes/cardsRoutes');

const NotFoundError = require('./src/errors/NotFoundError');

const errorMessage = 'Произошла ошибка';
const notFoundErrorMessage = 'Роут не найден';

const { PORT = 3000 } = process.env;
const app = express();
app.use(cookieParser());

app.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use((req, res, next) => {
  console.log(`${req.method}: ${req.path} ${JSON.stringify(req.body)}`);
  next();
});

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email({ tlds: { allow: false } }).required(),
    password: Joi.string().required(),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(/(?:https?):\/\/(\w+:?\w*)?(\S+)(:\d+)?(\.\w{2,3})(\/|\/([\w#!:.?+=&%!\-/]))?/),
    email: Joi.string().email({ tlds: { allow: false } }).required(),
    password: Joi.string().required(),
  }),
}), createUser);

app.use(auth);

app.use('/', userRoutes);
app.use('/', cardRoutes);
app.use('/', () => {
  throw new NotFoundError(notFoundErrorMessage);
});

app.use(errors());
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({ message: statusCode === 500 ? errorMessage : message });
  next();
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
