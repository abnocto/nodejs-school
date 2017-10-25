const bankUtils = {
  /**
  * Типы банковскиx карт
  * @type {Object}
  */
  cardTypes: {
    VISA: 'visa',
    MAESTRO: 'maestro',
    MASTERCARD: 'mastercard',
    MIR: 'mir',
  },

  /**
  * Проверяет тип карты
  * @param {Number} val номер карты
  * @returns {String} тип карты
  */
  getCardType(val) {
  // Бины ПС МИР 220000 - 220499
    const mirBin = /^220[0-4]\s?\d\d/;

    const firstNum = val[0];

    switch (firstNum) {
      case '2': {
        if (mirBin.test(val)) {
          return bankUtils.cardTypes.MIR;
        } 
        return '';
      }
      case '4': {
        return bankUtils.cardTypes.VISA;
      }
      case '5': {
        const secondNum = val[1] || '';

        if (secondNum === '0' || secondNum > '5') {
          return bankUtils.cardTypes.MAESTRO;
        } 
        return bankUtils.cardTypes.MASTERCARD;
      }
      case '6': {
        return bankUtils.cardTypes.MAESTRO;
      }
      default: {
        return '';
      }
    }
  },

  /**
  * Форматирует номер карты, используя заданный разделитель
  * @param {String} cardNumber номер карты
  * @param {String} delimeter = '\u00A0' разделитель
  * @returns {String} форматированный номер карты
  */
  formatCardNumber(cardNumber, delimeter) {
    const formattedCardNumber = [];
    if (cardNumber) {
      while (cardNumber && typeof cardNumber === 'string') {
        formattedCardNumber.push(cardNumber.substr(0, 4));
        if (cardNumber.substr(4)) {
          formattedCardNumber.push(delimeter || '\u00A0');
        }
      }
    }
    return formattedCardNumber.join('');
  },
  
  /**
   * Hides some cardNumber digits
   * @param {String} cardNumber card number
   * @returns {String} securedCardNumber
   */
  securify(cardNumber) {
    if (typeof cardNumber !== 'string') return cardNumber;
    // card-info problem... return `${cardNumber.slice(0, 7)}${'*'.repeat(6)}${cardNumber.slice(13)}`;
    return cardNumber;
  },

};

module.exports = bankUtils;
