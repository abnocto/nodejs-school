import CardInfo from 'card-info';

/**
 * @param {Object} card
 * @returns {Object}
 */
export function prepareCardData(card) {
  const cardInfo = new CardInfo(card.cardNumber, {
    banksLogosPath: '/assets/',
    brandsLogosPath: '/assets/',
  });
  
  return {
    id: card.id,
    balance: card.balance,
    number: cardInfo.numberNice,
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
