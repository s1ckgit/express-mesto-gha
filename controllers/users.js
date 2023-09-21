const { ValidationError, CastError } = require('mongoose').Error;

const User = require('../models/user');

const {
  BAD_REQUEST_CODE,
  NOT_FOUND_CODE,
  SERVER_ERROR_CODE,
  SUCCES_CREATED_CODE
} = require('../data/responseStatuses');

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({
    name,
    about,
    avatar
  })
    .then((user) => res.status(SUCCES_CREATED_CODE).send(user))
    .catch((e) => {
      if (e instanceof ValidationError) {
        res.status(BAD_REQUEST_CODE).send({ message: 'Ошибка валидации, проверьте корректность данных' });
      } else {
        res.status(SERVER_ERROR_CODE).send({ message: 'Произошла ошибка на стороне сервера' });
      }
    });
};

module.exports.getUser = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (user) {
        res.send(user);
      } else {
        res.status(NOT_FOUND_CODE).send({ message: 'Такого пользователя не существует' });
      }
    })
    .catch((e) => {
      if (e instanceof CastError) {
        res.status(BAD_REQUEST_CODE).send({ message: 'Передан некорректный id пользователя' });
      } else {
        res.status(SERVER_ERROR_CODE).send({ message: 'Произошла ошибка на стороне сервера' });
      }
    });
};

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => res.status(SERVER_ERROR_CODE).send({ message: 'Произошла ошибка на стороне сервера' }));
};

module.exports.updateProfile = (req, res) => {
  const { name, about, avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about, avatar }, {
    new: true,
    runValidators: true
  })
    .then((user) => res.send(user))
    .catch((e) => {
      if (e instanceof ValidationError) {
        res.status(BAD_REQUEST_CODE).send({ message: 'Ошибка валидации, проверьте корректность данных' });
      } else {
        res.status(SERVER_ERROR_CODE).send({ message: 'Произошла ошибка на стороне сервера' });
      }
    });
};
