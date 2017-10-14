import React from 'react';
import PropTypes from 'prop-types';
import MobilePaymentContract from './MobilePaymentContract';
import MobilePaymentResult from './MobilePaymentResult';
import { OFF } from '../constants/card';

const MobilePayment = ({ user, preparedActiveCard, mobilePaymentStatus, mobilePaymentTransactions, reset, pay }) => {
  if (mobilePaymentStatus !== OFF) {
    return (
      <MobilePaymentResult
        user={user}
        mobilePaymentStatus={mobilePaymentStatus}
        mobilePaymentTransactions={mobilePaymentTransactions}
        reset={() => reset()}
      />
    );
  }
  
  return (
    <MobilePaymentContract
      user={user}
      preparedActiveCard={preparedActiveCard}
      pay={(cardId, data) => pay(cardId, data)}
    />
  );
};

MobilePayment.propTypes = {
  user: PropTypes.object.isRequired,
  preparedActiveCard: PropTypes.object.isRequired,
  mobilePaymentStatus: PropTypes.string.isRequired,
  mobilePaymentTransactions: PropTypes.array.isRequired,
  reset: PropTypes.func.isRequired,
  pay: PropTypes.func.isRequired,
};

export default MobilePayment;
