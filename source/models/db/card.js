const mongoose = require('mongoose');
const Counter = require('./counter');
const logger = require('../../../libs/logger')('CardSchema');

const Schema = mongoose.Schema;

const cardSchema = new Schema({
  
  id: {
    type: Number,
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

cardSchema.pre('save', async function cb(next) {
  try {
    const counterObj = await Counter.findOneAndUpdate({ id: 'Card' }, { $inc: { value: 1 } }, { new: true });
    this.id = counterObj.value;
    next();
  } catch (err) {
    logger.error(`Error in pre save middleware: ${err.message}`);
    next(err);
  }
});

const Card = mongoose.model('Card', cardSchema);

module.exports = Card;
