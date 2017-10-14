import React from 'react';
import PropTypes from 'prop-types';
import MobilePaymentContract from './MobilePaymentContract';
import MobilePaymentResult from './MobilePaymentResult';
import WithdrawContract from './WithdrawContract';
import WithdrawResult from './WithdrawResult';
import PrepaidContract from './PrepaidContract';
import PrepaidResult from './PrepaidResult';
import { prepareCardData } from '../service/cardService';
import {
  PAYMENT_MOBILE_MODE, WITHDRAW_CARD_MODE, PREPAID_CARD_MODE,
  ACTIVE_CARD_ID_PROP, WITHDRAW_CARD_ID_PROP, PREPAID_CARD_ID_PROP,
  OFF,
} from '../constants/card';

const CardMode = ({ mode, userState, cardState, transactionState, cardActions, onCardChange }) => {
  
  const preparedCardsList = cardState.keys.map(id => prepareCardData(cardState.byId[id]));
  const preparedInactiveCardsList = preparedCardsList.filter(card => card.id === cardState[ACTIVE_CARD_ID_PROP] ? false : card);
  const preparedActiveCard = (cardState[ACTIVE_CARD_ID_PROP] !== -1) ? preparedCardsList.find(card => card.id === cardState[ACTIVE_CARD_ID_PROP]) : null;
  
  let ModeResult;
  let ModeContract;
  let preparedModeCard;
  switch (mode) {
    case PAYMENT_MOBILE_MODE:
      ModeResult = MobilePaymentResult;
      ModeContract = MobilePaymentContract;
      break;
  
    case WITHDRAW_CARD_MODE:
      ModeResult = WithdrawResult;
      ModeContract = WithdrawContract;
      preparedModeCard = (cardState[WITHDRAW_CARD_ID_PROP] !== -1) ? preparedCardsList.find(card => card.id === cardState[WITHDRAW_CARD_ID_PROP]) : null;
      break;
  
    case PREPAID_CARD_MODE:
      ModeResult = PrepaidResult;
      ModeContract = PrepaidContract;
      preparedModeCard = (cardState[PREPAID_CARD_ID_PROP] !== -1) ? preparedCardsList.find(card => card.id === cardState[PREPAID_CARD_ID_PROP]) : null;
      break;
  }
  
  if (cardState[mode] !== OFF) {
    return (
      <ModeResult
        user={userState}
        modeStatus={cardState[mode]}
        modeTransactions={transactionState[`${mode}Transactions`]}
        reset={() => cardActions.reset(mode)}
      />
    );
  }
  
  return (
    <ModeContract
      user={userState}
      preparedActiveCard={preparedActiveCard}
      preparedModeCard={preparedModeCard}
      preparedInactiveCardsList={preparedInactiveCardsList}
      transfer={(cardId, data) => cardActions.transfer(mode, cardId, data)}
      pay={(cardId, data) => cardActions.pay(mode, cardId, data)}
      onCardChange={id => onCardChange(id)}
    />
  );
};

CardMode.propTypes = {
  mode: PropTypes.string.isRequired,
  userState: PropTypes.object.isRequired,
  cardState: PropTypes.object.isRequired,
  transactionState: PropTypes.object.isRequired,
  cardActions: PropTypes.object.isRequired,
  onCardChange: PropTypes.func,
};

export default CardMode;
