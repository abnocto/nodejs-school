import React from 'react';
import PropTypes from 'prop-types';
import WithdrawContract from './WithdrawContract';
import WithdrawResult from './WithdrawResult';
import { OFF } from '../constants/card';

const Withdraw = (props) => {
  if (props.withdrawStatus !== OFF) {
    return (
      <WithdrawResult
        user={props.user}
        withdrawStatus={props.withdrawStatus}
        withdrawTransactions={props.withdrawTransactions}
        reset={() => props.reset()}
      />
    );
  }
  
  return (
    <WithdrawContract
      preparedActiveCard={props.preparedActiveCard}
      preparedWithdrawCard={props.preparedWithdrawCard}
      preparedInactiveCardsList={props.preparedInactiveCardsList}
      transfer={(cardId, data) => props.transfer(cardId, data)}
      onCardChange={id => props.onCardChange(id)}
    />
  );
};

Withdraw.propTypes = {
  user: PropTypes.object.isRequired,
  preparedActiveCard: PropTypes.object.isRequired,
  preparedWithdrawCard: PropTypes.object.isRequired,
  preparedInactiveCardsList: PropTypes.array.isRequired,
  withdrawStatus: PropTypes.string.isRequired,
  withdrawTransactions: PropTypes.array.isRequired,
  reset: PropTypes.func.isRequired,
  transfer: PropTypes.func.isRequired,
  onCardChange: PropTypes.func.isRequired,
};

export default Withdraw;
