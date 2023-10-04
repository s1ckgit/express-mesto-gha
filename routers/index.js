const router = require('express').Router();
const usersRouter = require('./users');
const cardsRouter = require('./cards');
const { createUser, login } = require('../controllers/users');
const auth = require('../middlewares/auth');
const signInValidation = require('../middlewares/signInValidation');
const signUpValidation = require('../middlewares/signUpValidation');
const NotFoundError = require('../errors/NotFound');

router.post('/signin', signInValidation, login);
router.post('/signup', signUpValidation, createUser);
router.use(auth);
router.use('/users', usersRouter);
router.use('/cards', cardsRouter);
router.use('*', (req, res, next) => {
  next(new NotFoundError());
});

module.exports = router;
