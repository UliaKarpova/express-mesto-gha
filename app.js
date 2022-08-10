const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./src/routes/usersRoutes');
const cardRoutes = require('./src/routes/cardsRoutes');

const { PORT = 3000 } = process.env;
const app = express();

app.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use((req, res, next) => {
  console.log(`${req.method}: ${req.path} ${JSON.stringify(req.body)}`);
  next();
});

app.use((req, res, next) => {
  req.user = {
    _id: '62f15f4e3b84c90962028d20',
  };
  next();
});

app.use('/', userRoutes);
app.use('/', cardRoutes);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
