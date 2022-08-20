const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

const { login, createUser } = require('./src/controllers/usersController');

const auth = require('./src/middlewares/auth');

const userRoutes = require('./src/routes/usersRoutes');
const cardRoutes = require('./src/routes/cardsRoutes');

const errorMessage = 'Произошла ошибка';

const { PORT = 3000 } = process.env;
const app = express();
app.use(cookieParser());

app.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use((req, res, next) => {
  console.log(`${req.method}: ${req.path} ${JSON.stringify(req.body)}`);
  next();
});

app.post('/signin', login);
app.post('/signup', createUser);

app.use(auth);

app.use('/', userRoutes);
app.use('/', cardRoutes);
app.use('/', (req, res) => {
  res.status(404).send({ message: 'Роут не найден' });
});

app.use((err, req, res) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({ message: statusCode === 500 ? errorMessage : message });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
