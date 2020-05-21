const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/users');
const { JWT_SECRET_KEY } = require('../config');
const NotFoundError = require('../errors/notFoundError');
const ConflictError = require('../errors/conflictError');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports.createUser = (req, res) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  User.countDocuments({ email })
    .then((count) => {
      if (count) throw new ConflictError('Пользователь с таким email уже существует в базе');

      bcrypt.hash(password, 10)
        .then((hash) => User.create({
          name,
          about,
          avatar,
          email,
          password: hash,
        }))
        .then((user) => res.send({ data: user.omitPrivate() }));
    })
    .catch((err) => {
      const statusCode = err.statusCode || 500;
      const message = statusCode === 500 ? 'Произошла ошибка' : err.message;
      res.status(statusCode).send({ message });
    });
};

module.exports.getUser = (req, res) => {
  User.findById(req.params.userId)
    .orFail(() => new NotFoundError('Нет пользователя с таким id'))
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      const statusCode = err.statusCode || 500;
      const message = statusCode === 500 ? 'Произошла ошибка' : err.message;
      res.status(statusCode).send({ message });
    });
};

module.exports.modifyUser = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, { runValidators: true, new: true })
    .then((user) => res.send({ data: user }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports.modifyAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, { runValidators: true }, { new: true })
    .then((user) => {
      res.send({ data: user });
    })
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET_KEY, { expiresIn: '7d' });
      res.send({ token });
    })
    .catch((err) => {
      const statusCode = err.statusCode || 500;
      const message = statusCode === 500 ? 'Произошла ошибка' : err.message;
      res.status(statusCode).send({ message });
    });
};
