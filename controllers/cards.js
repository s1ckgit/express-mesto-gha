const Card = require('../models/card');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка на стороне сервера' }));
};

module.exports.getCard = async (req, res) => {
  try {
    const card = await Card.findById(req.params.cardId);

    if (card) {
      res.send(card);
    } else {
      const err = new Error();
      err.name = 'CastError';
      throw err;
    }
  } catch (e) {
    if (e.name === 'CastError') {
      res.status(404).send({ message: 'Карточка не найдена' });
    } else {
      res.status(500).send({ message: 'Произошла ошибка на стороне сервера' });
    }
  }
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({
    name,
    link,
    owner: req.user._id
  })
    .then((card) => res.send(card))
    .catch((e) => {
      if (e.name === 'ValidationError') {
        res.status(400).send({ message: 'Ошибка валидации, проверьте корректность данных' });
      } else {
        res.status(500).send({ message: 'Произошла ошибка на стороне сервера' });
      }
    });
};

module.exports.deleteCard = async (req, res) => {
  try {
    const card = await Card.findByIdAndRemove(req.params.cardId);

    if (card) {
      res.send(card);
    } else {
      const err = new Error();
      err.name = 'CastError';
      throw err;
    }
  } catch (e) {
    if (e.name === 'CastError') {
      res.status(404).send({ message: 'Карточка не найдена' });
    } else {
      res.status(500).send({ message: 'Произошла ошибка на стороне сервера' });
    }
  }
};

module.exports.likeCard = async (req, res) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      {
        $addToSet: { likes: req.user._id }
      },
      { new: true }
    );

    if (card) {
      res.send(card);
    } else {
      const err = new Error();
      err.name = 'CastError';
      throw err;
    }
  } catch (e) {
    if (e.name === 'CastError') {
      res.status(404).send({ message: 'Карточка не найдена' });
    } else {
      res.status(500).send({ message: 'Произошла ошибка на стороне сервера' });
    }
  }
};

module.exports.dislikeCard = async (req, res) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      {
        $pull: { likes: req.user._id }
      },
      { new: true }
    );

    if (card) {
      res.send(card);
    } else {
      const err = new Error();
      err.name = 'CastError';
      throw err;
    }
  } catch (e) {
    if (e.name === 'CastError') {
      res.status(404).send({ message: 'Карточка не найдена' });
    } else {
      res.status(500).send({ message: 'Произошла ошибка на стороне сервера' });
    }
  }
};
