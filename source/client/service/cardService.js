import CardInfo from 'card-info';

/**
 * @param {Object} card
 * @returns {Object}
 */
export function prepareCardData(card) {
  const { cardNumber: number } = card;
  
  const validNumber = number.replace(/\*/g, '0');
  
  const cardInfo = new CardInfo(validNumber, {
    banksLogosPath: '/assets/',
    brandsLogosPath: '/assets/',
  });
  
  const niceNumber = `${number.slice(0, 4)} ${number.slice(4, 8)} ${number.slice(8, 12)} ${number.slice(12)}`;
  
  return {
    id: card.id,
    balance: card.balance,
    number: niceNumber,
    bankName: cardInfo.bankName,
    theme: {
      bgColor: cardInfo.backgroundColor,
      textColor: cardInfo.textColor,
      bankLogoUrl: cardInfo.bankLogoSvg,
      brandLogoUrl: cardInfo.brandLogoSvg,
      bankSmLogoUrl: `/assets/${cardInfo.bankAlias}-history.svg`,
    },
  };
}
