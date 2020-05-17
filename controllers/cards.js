const Card = require('../models/cards');

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
    .catch((err) => res.status(500).send({ message: `Произошла ошибка: + ${err}` }));
};

module.exports.deleteCard = (req, res) => {
  Card.findById(req.params.cardId)
    .then((cards) => {
      if (!cards) {
        res.status(404).send({ message: 'Нет карточки с таким id' });
        return;
      }
      if (cards.owner.toString() === req.user._id) {
        res.send({ data: cards });
        return Card.findByIdAndRemove(req.params.cardId);
      }

      return Promise.reject(new Error('Карточка с таким id создана не вами'));
    })
    .catch((err) => res.status(500).send({ message: `Произошла ошибка - ${err}` }));
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .then((cards) => {
      if (!cards) {
        res.status(404).send({ message: 'Нет карточки с таким id' });
        return;
      }
      res.send({ data: cards });
    })
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .then((cards) => {
      if (!cards) {
        res.status(404).send({ message: 'Нет карточки с таким id' });
        return;
      }
      res.send({ data: cards });
    })
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};
