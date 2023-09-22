const { ValidationError, CastError, DocumentNotFoundError } = require('mongoose').Error;

const Card = require('../models/card');

const {
  BAD_REQUEST_CODE,
  NOT_FOUND_CODE,
  SERVER_ERROR_CODE,
  SUCCES_CREATED_CODE,
} = require('../data/responseStatuses');

module.exports.getCards = (req, res) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => res.send(cards))
    .catch(() => res.status(SERVER_ERROR_CODE).send({ message: 'Произошла ошибка на стороне сервера' }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({
    name,
    link,
    owner: req.user._id,
  })
    .then((card) => res.status(SUCCES_CREATED_CODE).send(card))
    .catch((e) => {
      if (e instanceof ValidationError) {
        res.status(BAD_REQUEST_CODE).send({ message: 'Ошибка валидации, проверьте корректность данных' });
      } else {
        res.status(SERVER_ERROR_CODE).send({ message: 'Произошла ошибка на стороне сервера' });
      }
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId).orFail()
    .then((card) => {
      res.send(card);
    })
    .catch((e) => {
      if (e instanceof CastError) {
        res.status(BAD_REQUEST_CODE).send({ message: 'Ошибка валидации, проверьте введённые данные' });
      } else if (e instanceof DocumentNotFoundError) {
        res.status(NOT_FOUND_CODE).send({ message: 'Такой карточки не существует' });
      } else {
        res.status(SERVER_ERROR_CODE).send({ message: 'Произошла ошибка на стороне сервера' });
      }
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  ).orFail()
    .then((card) => {
      res.send(card);
    })
    .catch((e) => {
      if (e instanceof CastError) {
        res.status(BAD_REQUEST_CODE).send({ message: 'Переданы некорректные данные' });
      } else if (e instanceof DocumentNotFoundError) {
        res.status(NOT_FOUND_CODE).send({ message: 'Такой карточки не существует' });
      } else {
        res.status(SERVER_ERROR_CODE).send({ message: 'Произошла ошибка на стороне сервера' });
      }
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  ).orFail()
    .then((card) => {
      res.send(card);
    })
    .catch((e) => {
      if (e instanceof CastError) {
        res.status(BAD_REQUEST_CODE).send({ message: 'Переданы некорректные данные' });
      } else if (e instanceof DocumentNotFoundError) {
        res.status(NOT_FOUND_CODE).send({ message: 'Такой карточки не существует' });
      } else {
        res.status(SERVER_ERROR_CODE).send({ message: 'Произошла ошибка на стороне сервера' });
      }
    });
};
