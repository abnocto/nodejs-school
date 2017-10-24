const mongoose = require('mongoose');
const Counter = require('./counter');
const logger = require('../../../libs/logger')('TransactionSchema');

const Schema = mongoose.Schema;

const transactionSchema = new Schema({
    
  id: {
    type: Number,
  },

  cardId: {
    type: Number,
    required: true,
  },
  
  type: {
    type: String,
    enum: ['prepaidCard', 'card2Card', 'paymentMobile'],
    required: true,
  },
  
  data: {
    type: String,
    required: true,
  },
  
  time: {
    type: String,
    required: true,
  },
  
  sum: {
    type: Number,
    required: true,
  },

});

transactionSchema.pre('save', async function cb(next) {
  try {
    const counterObj = await Counter.findOneAndUpdate({ id: 'Transaction' }, { $inc: { value: 1 } }, { new: true });
    this.id = counterObj.value;
    next();
  } catch (err) {
    logger.error(`Error in pre save middleware: ${err.message}`);
    next(err);
  }
});

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
