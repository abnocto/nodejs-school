import React from 'react';
import PropTypes from 'prop-types';
import PrepaidContract from './PrepaidContract';
import PrepaidResult from './PrepaidResult';
import { OFF } from '../constants/card';

const Prepaid = (props) => {
  if (props.prepaidStatus !== OFF) {
    return (
      <PrepaidResult
        user={props.user}
        prepaidStatus={props.prepaidStatus}
        prepaidTransactions={props.prepaidTransactions}
        reset={() => props.reset()}
      />
    );
  }
  
  return (
    <PrepaidContract
      preparedActiveCard={props.preparedActiveCard}
      preparedPrepaidCard={props.preparedPrepaidCard}
      preparedInactiveCardsList={props.preparedInactiveCardsList}
      transfer={(cardId, data) => props.transfer(cardId, data)}
      onCardChange={id => props.onCardChange(id)}
    />
  );
};

Prepaid.propTypes = {
  user: PropTypes.object.isRequired,
  preparedActiveCard: PropTypes.object.isRequired,
  preparedPrepaidCard: PropTypes.object.isRequired,
  preparedInactiveCardsList: PropTypes.array.isRequired,
  prepaidStatus: PropTypes.string.isRequired,
  prepaidTransactions: PropTypes.array.isRequired,
  reset: PropTypes.func.isRequired,
  transfer: PropTypes.func.isRequired,
  onCardChange: PropTypes.func.isRequired,
};

export default Prepaid;
