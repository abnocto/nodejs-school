const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const transactionSchema = new Schema({
    
  id: {
    type: Number,
    required: true,
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

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
