// const bcrypt = require('bcryptjs');
const router = require('express').Router();
const cards = require('./cards');
const users = require('./users');

router.use('/cards', cards);
router.use('/users', users);

module.exports = router;
