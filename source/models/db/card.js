const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const cardSchema = new Schema({
  
  id: {
    type: Number,
    required: true,
  },
  
  cardNumber: {
    type: String,
    required: true,
  },
  
  balance: {
    type: Number,
    required: true,
  },
  
});

const Card = mongoose.model('Card', cardSchema);

module.exports = Card;
