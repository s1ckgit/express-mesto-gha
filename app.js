const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const cookieParser = require('cookie-parser');
const router = require('./routers/index');
const errorHandler = require('./middlewares/errorHandler');

const { PORT = 3000 } = process.env;

const app = express();
mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use((req, res, next) => {
  if (req.cookies.jwt) {
    req.headers.authorization = `Bearer ${req.cookies.jwt}`;
  }
  next();
});
app.use('/', router);
app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log('Полёт нормальный');
});
