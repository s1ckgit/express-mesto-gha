const router = require('express').Router();
const {
  createUser, getUsers, getUser, updateProfile
} = require('../controllers/users');

router.get('/', getUsers);

router.get('/:userId', getUser);

router.post('/', createUser);

router.patch('/me', updateProfile);

router.patch('/me/avatar', updateProfile);

module.exports = router;
