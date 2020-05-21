const Card = require('../models/cards');
const NotFoundError = require('../errors/notFoundError');
const ForbiddenError = require('../errors/forbiddenError');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports.createCard = (req, res) => {
  const {
    name, link, likes, createdAt,
  } = req.body;
  const owner = req.user._id;

  Card.create({
    name, link, owner, likes, createdAt,
  })
    .then((cards) => res.send({ data: cards }))
    .catch((err) => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports.deleteCard = (req, res) => {
  Card.findById({ _id: req.params.cardId })
    .orFail(() => new NotFoundError('Нет карточки с таким id'))
    .then((cards) => {
      if (cards.owner.equals(req.user._id)) {
        res.send({ data: cards });
        return Card.findByIdAndRemove(req.params.cardId);
      }

      return Promise.reject(new ForbiddenError('Карточка с таким id создана не вами'));
    })
    .catch((err) => {
      const statusCode = err.statusCode || 500;
      const message = statusCode === 500 ? 'Произошла ошибка' : err.message;
      res.status(statusCode).send({ message });
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .orFail(() => new NotFoundError('Нет карточки с таким id'))
    .then((cards) => {
      res.send({ data: cards });
    })
    .catch((err) => {
      const statusCode = err.statusCode || 500;
      const message = statusCode === 500 ? 'Произошла ошибка' : err.message;
      res.status(statusCode).send({ message });
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .orFail(() => new NotFoundError('Нет карточки с таким id'))
    .then((cards) => {
      res.send({ data: cards });
    })
    .catch((err) => {
      const statusCode = err.statusCode || 500;
      const message = statusCode === 500 ? 'Произошла ошибка' : err.message;
      res.status(statusCode).send({ message });
    });
};
