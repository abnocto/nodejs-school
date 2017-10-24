const Model = require('./model');

module.exports = new Model([
  {
    id: 1,
    cardId: 1,
    type: 'prepaidCard',
    data: '220003000000003',
    time: '2017-10-04T05:28:31+03:00',
    sum: 2345,
  },
  {
    id: 2,
    cardId: 1,
    type: 'card2Card',
    data: '220003000000012',
    time: '2017-10-04T05:28:31+03:00',
    sum: 34565,
  },
]);
