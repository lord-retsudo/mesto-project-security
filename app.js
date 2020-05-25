const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const router = require('./routes/router');
const {
  PORT, DATABASE_URL,
} = require('./config');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(DATABASE_URL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use('/', router);
app.use('/', (req, res) => { res.status(404).json({ message: 'Запрашиваемый ресурс не найден' }); });

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
