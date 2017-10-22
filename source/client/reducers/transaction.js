import { getInitialState, create, read } from '../service/reducersObjectService';
import {
  ACTION_CARD_MODE_SUCCESS,
} from '../constants/card';
import {
  PAYMENT_MOBILE_MODE_TRANSACTIONS,
  WITHDRAW_CARD_MODE_TRANSACTIONS,
  PREPAID_CARD_MODE_TRANSACTIONS,
} from '../constants/transaction';

/**
 * @typedef {Object} Transaction
 * @property {String} id
 * @property {String} cardId
 * @property {String} type [ prepaidCard | card2Card | paymentMobile ]
 * @property {String} data
 * @property {String} time (ISO)
 * @property {Number} sum
 **
 * Transaction state special properties:
 * {Object} [PAYMENT_MOBILE_MODE_TRANSACTIONS]
 * {Object} [WITHDRAW_MODE_TRANSACTIONS]
 * {Object} [PREPAID_MODE_TRANSACTIONS]
 */

export default (state = getInitialState(), action) => {
  switch (action.type) {
    case ACTION_CARD_MODE_SUCCESS:
      return {
        ...action.payload.transactions.reduce((currState, transaction) => create(currState, transaction), state),
        [`${action.payload.mode}Transactions`]: action.payload.transactions,
      };
    
    default:
      return state;
  }
};

/**
 * Reads transactions from server list
 * @param { Object } state
 * @param { Array } list
 * @returns { Object }
 */
export function readTransactions(state, list) {
  const _state = read(state, list);
  return {
    ..._state,
    [PAYMENT_MOBILE_MODE_TRANSACTIONS]: [],
    [WITHDRAW_CARD_MODE_TRANSACTIONS]: [],
    [PREPAID_CARD_MODE_TRANSACTIONS]: [],
  };
}
