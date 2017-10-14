import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import styled from 'emotion/react';
import { injectGlobal } from 'emotion';
import CardInfo from 'card-info';
import * as cardActions from '../actions/card';
import {
  PAYMENT_MOBILE_MODE, WITHDRAW_CARD_MODE, PREPAID_CARD_MODE,
  ACTIVE_CARD_ID_PROP, WITHDRAW_CARD_ID_PROP, PREPAID_CARD_ID_PROP,
} from '../constants/card';
import { PAYMENT_MOBILE_MODE_TRANSACTIONS, WITHDRAW_CARD_MODE_TRANSACTIONS, PREPAID_CARD_MODE_TRANSACTIONS } from '../constants/transaction';
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
   * @param {String} type Card selection type
   * @param {Number} id Card id
   */
  onCardChange(type, id) {
    const { cardState } = this.props;
    if (id === cardState[type]) return;
    cardState[type] = id;
    if (type === ACTIVE_CARD_ID_PROP) {
      const inactiveKey = cardState.keys.find(key => key !== id) || -1;
      if (id === cardState[WITHDRAW_CARD_ID_PROP]) cardState[WITHDRAW_CARD_ID_PROP] = inactiveKey;
      if (id === cardState[PREPAID_CARD_ID_PROP]) cardState[PREPAID_CARD_ID_PROP] = inactiveKey;
      [PAYMENT_MOBILE_MODE, WITHDRAW_CARD_MODE, PREPAID_CARD_MODE].forEach(mode => this.props.cardActions.reset(mode));
    }
    this.props.cardActions.setActive(cardState[ACTIVE_CARD_ID_PROP], cardState[WITHDRAW_CARD_ID_PROP], cardState[PREPAID_CARD_ID_PROP]);
  }
  
  /**
   * @param {Object} cardsData
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
  
  render() {
    const { userState, cardState, transactionState } = this.props;
    const { pay, reset, transfer } = this.props.cardActions;
    
    const cardsList = cardState.keys.map(id => cardState.byId[id]);
    const preparedCardsList = this.prepareCardsData(cardsList);
    
    const preparedInactiveCardsList = preparedCardsList.filter(card => card.id === cardState[ACTIVE_CARD_ID_PROP] ? false : card);
    
    const preparedActiveCard = (cardState[ACTIVE_CARD_ID_PROP] !== -1) ? preparedCardsList.find(card => card.id === cardState[ACTIVE_CARD_ID_PROP]) : null;
    const preparedWithdrawCard = (cardState[WITHDRAW_CARD_ID_PROP] !== -1) ? preparedCardsList.find(card => card.id === cardState[WITHDRAW_CARD_ID_PROP]) : null;
    const preparedPrepaidCard = (cardState[PREPAID_CARD_ID_PROP] !== -1) ? preparedCardsList.find(card => card.id === cardState[PREPAID_CARD_ID_PROP]) : null;
  
    const transactionsList = transactionState.keys.map(id => transactionState.byId[id]);
    const preparedTransactionsList = transactionsList.map((data) => {
      const card = preparedCardsList.find(card => card.id === data.cardId);
      return card ? Object.assign({}, data, { card }) : data;
    });
    
    const preparedActiveCardTransactionsList = preparedTransactionsList.filter(data => data.cardId === cardState[ACTIVE_CARD_ID_PROP]);
    
    return (
      <Wallet>
        <CardsBar
          preparedActiveCard={preparedActiveCard}
          preparedCardsList={preparedCardsList}
          onCardChange={id => this.onCardChange(ACTIVE_CARD_ID_PROP, id)}
        />
        <CardPane>
          <Header
            user={userState}
            preparedActiveCard={preparedActiveCard}
          />
          <Workspace>
            <History
              cardHistory={preparedActiveCardTransactionsList}
            />
            <Prepaid
              user={userState}
              preparedActiveCard={preparedActiveCard}
              preparedPrepaidCard={preparedPrepaidCard}
              preparedInactiveCardsList={preparedInactiveCardsList}
              prepaidStatus={cardState[PREPAID_CARD_MODE]}
              prepaidTransactions={transactionState[PREPAID_CARD_MODE_TRANSACTIONS]}
              reset={() => reset(PREPAID_CARD_MODE)}
              transfer={(cardId, data) => transfer(PREPAID_CARD_MODE, cardId, data)}
              onCardChange={id => this.onCardChange(PREPAID_CARD_ID_PROP, id)}
            />
            <MobilePayment
              user={userState}
              preparedActiveCard={preparedActiveCard}
              mobilePaymentStatus={cardState[PAYMENT_MOBILE_MODE]}
              mobilePaymentTransactions={transactionState[PAYMENT_MOBILE_MODE_TRANSACTIONS]}
              reset={() => reset(PAYMENT_MOBILE_MODE)}
              pay={(cardId, data) => pay(PAYMENT_MOBILE_MODE, cardId, data)}
            />
            <Withdraw
              user={userState}
              preparedActiveCard={preparedActiveCard}
              preparedWithdrawCard={preparedWithdrawCard}
              preparedInactiveCardsList={preparedInactiveCardsList}
              withdrawStatus={cardState[WITHDRAW_CARD_MODE]}
              withdrawTransactions={transactionState[WITHDRAW_CARD_MODE_TRANSACTIONS]}
              reset={() => reset(WITHDRAW_CARD_MODE)}
              transfer={(cardId, data) => transfer(WITHDRAW_CARD_MODE, cardId, data)}
              onCardChange={id => this.onCardChange(WITHDRAW_CARD_ID_PROP, id)}
            />
          </Workspace>
        </CardPane>
      </Wallet>
    );
  }
}

export default connect(
  state => ({
    userState: state.user,
    cardState: state.card,
    transactionState: state.transaction,
  }),
  dispatch => ({
    cardActions: bindActionCreators(cardActions, dispatch),
  }),
)(App);
