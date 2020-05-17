const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const router = require('./routes/router');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const { PORT, DATABASE_URL } = require('./config');
// const { PORT = 3000 } = process.env;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(DATABASE_URL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

// app.use(express.static(path.join(__dirname, 'public')));

/*
app.use((req, res, next) => {
  req.user = {
    _id: '5eb2a9b97f23d358845b6d4f',
  };

  next();
});
*/

app.post('/signin', login);
app.post('/signup', createUser);

app.use(auth);

app.use('/', router);
app.use('/', (req, res) => { res.status(404).json({ message: 'Запрашиваемый ресурс не найден' }); });

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
