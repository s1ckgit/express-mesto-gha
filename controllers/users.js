const User = require('../models/user');

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({
    name,
    about,
    avatar
  })
    .then((user) => res.send(user))
    .catch((e) => {
      if (e.name === 'ValidationError') {
        res.status(400).send({ message: 'Ошибка валидации, проверьте корректность данных' });
      } else {
        res.status(500).send({ message: 'Произошла ошибка на стороне сервера' });
      }
    });
};

module.exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);

    if (user) {
      res.send(user);
    } else {
      const err = new Error();
      err.name = 'CastError';
      throw err;
    }
  } catch (e) {
    if (e.name === 'CastError') {
      res.status(404).send({ message: 'Пользователь не найден' });
    } else {
      res.status(500).send({ message: 'Произошла ошибка на стороне сервера' });
    }
  }
};

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка на стороне сервера' }));
};

module.exports.updateProfile = async (req, res) => {
  try {
    const { name, about, avatar } = req.body;
    let user = await User.findByIdAndUpdate(req.user._id, {
      name,
      about,
      avatar
    });
    user = await User.findByIdAndUpdate(req.user._id, {
      name,
      about
    });
    // 2 раза, чтобы вернуть обновлённые данные, а этот метод возвращает данные до изменения
    if (user && user.name.length < 30 && user.about.length < 30) {
      res.send(user);
    } else if (!user) {
      const err = new Error();
      err.name = 'CastError';
      throw err;
    } else {
      const err = new Error();
      err.name = 'ValidationError';
      throw err;
    }
  } catch (e) {
    if (e.name === 'CastError') {
      res.status(404).send({ message: 'Пользователь не найден' });
    } else if (e.name === 'ValidationError') {
      res.status(400).send({ message: 'Ошибка валидации, проверьте введённые данные' });
    } else {
      console.log(e);
      res.status(500).send({ message: 'Произошла ошибка на стороне сервера' });
    }
  }
};
