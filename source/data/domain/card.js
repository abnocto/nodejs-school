const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const cardSchema = new Schema(
  
  {
  
    cardNumber: {
      type: String,
      required: true,
    },
    
    balance: {
      type: Number,
      required: true,
    },
    
  },
  
  {
    versionKey: false,
  },
  
);

const Card = mongoose.model('Card', cardSchema);

module.exports = Card;
