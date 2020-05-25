const router = require('express').Router();
const { login, createUser } = require('../controllers/users');
const auth = require('../middlewares/auth');
const cards = require('./cards');
const users = require('./users');

router.post('/signin', login);
router.post('/signup', createUser);

router.use(auth);

router.use('/cards', cards);
router.use('/users', users);

module.exports = router;
