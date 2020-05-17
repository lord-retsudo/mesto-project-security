const mongoose = require('mongoose');
const validator = require('validator');

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;
const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  link: {
    type: String,
    validate: {
      validator(link) {
        return validator.isURL(link);
      },
      message: (link) => `${link.value} некорректный адрес!`,
    },
    required: true,
  },
  owner: {
    type: ObjectId,
    required: true,
  },
  likes:
    [{
      type: mongoose.ObjectId,
      default: [],
    }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('card', cardSchema);
