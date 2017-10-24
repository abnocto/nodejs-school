const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const counterSchema = new Schema({
  
  id: {
    type: String,
    required: true,
  },
  
  value: {
    type: Number,
    required: true,
  },
  
});

const Counter = mongoose.model('Counter', counterSchema);

module.exports = Counter;
