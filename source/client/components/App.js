import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'emotion/react';
import { injectGlobal } from 'emotion';
import CardInfo from 'card-info';
import {
  CardsBar,
  Header,
  History,
  Prepaid,
  MobilePayment,
  Withdraw,
} from './';

import './fonts.css';

injectGlobal`
  html,
  body {
   margin: 0;
  }

  #root {
   height: 100%;
   font-family: 'Open Sans';
   color: #000;
  }
`;

const Wallet = styled.div`
  display: flex;
  min-height: 100%;
  background-color: #fcfcfc;
`;

const CardPane = styled.div`
  flex-grow: 1;
`;

const Workspace = styled.div`
  display: flex;
  flex-wrap: wrap;
  max-width: 970px;
  padding: 15px;
`;

/**
 * Приложение
 */
class App extends Component {
  /**
   * Конструктор
   */
  constructor(props) {
    super(props);
    
    this.state = {
      activeCardIndex: 0,
    };
  }
  
  /**
   * Обработчик переключения карты
   *
   * @param {Number} activeCardIndex индекс выбранной карты
   */
  onCardChange(activeCardIndex) {
    this.setState({ activeCardIndex });
  }
  
  /**
   * Подготавливает данные карт
   *
   * @param {Object} cardsData данные карт
   * @returns {Object[]}
   */
  prepareCardsData(cardsData) {
    return cardsData.map((card) => {
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
    });
  }
  
  /**
   * Рендер компонента
   *
   * @override
   * @returns {JSX}
   */
  render() {
    const { card, transaction } = this.props;
  
    const cardsData = card.keys.map(id => card.byId[id]);
    const transactionsData = transaction.keys.map(id => transaction.byId[id]);
  
    const cardsList = this.prepareCardsData(cardsData);
    const cardHistory = transactionsData.map((data) => {
      const card = cardsList.find(card => card.id === data.cardId);
      return card ? Object.assign({}, data, { card }) : data;
    });
    
    const { activeCardIndex } = this.state;
    const activeCard = cardsList[activeCardIndex];
    
    const inactiveCardsList = cardsList.filter((card, index) => index === activeCardIndex ? false : card);
    const filteredHistory = cardHistory.filter(data => data.cardId === activeCard.id);
    
    return (
      <Wallet>
        <CardsBar
          activeCardIndex={activeCardIndex}
          cardsList={cardsList}
          onCardChange={activeCardIndex => this.onCardChange(activeCardIndex)}
        />
        <CardPane>
          <Header activeCard={activeCard} />
          <Workspace>
            <History cardHistory={filteredHistory} />
            <Prepaid
              activeCard={activeCard}
              inactiveCardsList={inactiveCardsList}
              onCardChange={newActiveCardIndex => this.onCardChange(newActiveCardIndex)}
            />
            <MobilePayment activeCard={activeCard} />
            <Withdraw
              activeCard={activeCard}
              inactiveCardsList={inactiveCardsList}
            />
          </Workspace>
        </CardPane>
      </Wallet>
    );
  }
}

export default connect(
  state => ({
    user: state.user,
    card: state.card,
    transaction: state.transaction,
  }),
  null,
)(App);
