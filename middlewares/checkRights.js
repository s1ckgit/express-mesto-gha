const Card = require('../models/card');
const UnathorizedError = require('../errors/Unathorized');
const { FORBIDDEN_CODE } = require('../data/responseStatuses');

module.exports = (req, res, next) => {
  Card.findById(req.params.cardId).orFail()
    .then((card) => {
      if (card.owner._id.toString() === req.user._id) {
        next();
      } else {
        next(new UnathorizedError('У вас недостаточно прав', FORBIDDEN_CODE));
      }
    })
    .catch(next);
};
