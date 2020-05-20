const users = require('express').Router();

const {
  getUsers, getUser, modifyUser, modifyAvatar,
} = require('../controllers/users');

users.get('/', getUsers);
users.get('/:userId', getUser);
users.patch('/me', modifyUser);
users.patch('/me/avatar', modifyAvatar);

module.exports = users;
