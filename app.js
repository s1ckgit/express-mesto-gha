const express = require('express');
const mongoose = require('mongoose');
const { celebrate, Joi, errors } = require('celebrate');
const { ValidationError, CastError, DocumentNotFoundError } = require('mongoose').Error;
const cookieParser = require('cookie-parser');
const UnathorizedError = require('./errors/Unathorized');
const router = require('./routers/index');
const { login, createUser } = require('./controllers/users');
const {
  BAD_REQUEST_CODE,
  NOT_FOUND_CODE,
  SERVER_ERROR_CODE,
  ALREADY_EXIST_CODE,
} = require('./data/responseStatuses');
const auth = require('./middlewares/auth');

const { PORT = 3000 } = process.env;

const app = express();
mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
}), login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }).unknown(true),
}), createUser);
app.use((req, res, next) => {
  if (req.cookies.jwt) {
    req.headers.authorization = `Bearer ${req.cookies.jwt}`;
  }
  next();
});
app.use(auth);
app.use((req, res, next) => {
  next();
});
app.use('/', router);
app.use('*', (req, res) => {
  res.status(NOT_FOUND_CODE).send({ message: 'Данная страница не найдена' });
});
app.use(errors());
app.use((err, req, res, next) => {
  if (err instanceof CastError) {
    res.status(BAD_REQUEST_CODE).send({ message: 'Проверьте корректность введённых данных' });
  } else if (err instanceof DocumentNotFoundError) {
    res.status(NOT_FOUND_CODE).send({ message: 'Данные не были найдены' });
  } else if (err instanceof ValidationError) {
    res.status(BAD_REQUEST_CODE).send({ message: 'Ошибка валидации, проверьте корректность данных' });
  } else if (err instanceof UnathorizedError) {
    res.status(err.statusCode).send({ message: err.message });
  } else if (err.code === 11000) {
    res.status(ALREADY_EXIST_CODE).send({ message: 'Такой пользователь уже существует' });
  } else {
    res.status(SERVER_ERROR_CODE).send({ message: 'Произошла ошибка на стороне сервера' });
  }
  next();
});

app.listen(PORT, () => {
  console.log('Полёт нормальный');
});
