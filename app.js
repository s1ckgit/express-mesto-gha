const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const userRouter = require('./routers/users');
const cardRouter = require('./routers/cards');
const { NOT_FOUND_CODE } = require('./data/responseStatuses')

const { PORT = 3000 } = process.env;

const app = express();
mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  req.user = {
    _id: '65087dfd374d7b0ec30e841a'
  };

  next();
});

app.use('/users', userRouter);
app.use('/cards', cardRouter);
app.use('*', (req, res) => {
  res.status(NOT_FOUND_CODE).send({ message: 'Данная страница не найдена' })
})

app.listen(PORT, () => {
  console.log('Полёт нормальный');
});
