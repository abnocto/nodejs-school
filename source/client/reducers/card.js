import { getInitialState, update, read } from '../service/reducersObjectService';
import {
  ACTION_CARD_SELECT,
  ACTION_CARD_MODE_CHANGE,
  ACTION_CARD_MODE_SUCCESS,
  ACTIVE_CARD_ID_PROP,
  WITHDRAW_CARD_ID_PROP,
  PREPAID_CARD_ID_PROP,
  PAYMENT_MOBILE_MODE,
  WITHDRAW_CARD_MODE,
  PREPAID_CARD_MODE,
  OFF, SUCCESS,
} from '../constants/card';

/**
 * @typedef {Object} Card
 * @property {String} id
 * @property {String} cardNumber
 * @property {Number} balance
 **
 * Card state special properties:
 * {String} [ACTIVE_CARD_ID_PROP]
 * {String} [WITHDRAW_CARD_ID_PROP]
 * {String} [PREPAID_CARD_ID_PROP]
 * {String} [PAYMENT_MOBILE_MODE]: [ OFF (default) | PENDING | SUCCESS | FORBIDDEN | ERROR ]
 * {String} [WITHDRAW_CARD_MODE]: [ OFF (default) | PENDING | SUCCESS | FORBIDDEN | ERROR ]
 * {String} [PREPAID_CARD_MODE]: [ OFF (default) | PENDING | SUCCESS | FORBIDDEN | ERROR ]
 *
 */

export default (state = getInitialState(), action) => {
  switch (action.type) {
    /**
     * @typedef {Object} ActionCardSelect
     * @property {String} type [ACTION_CARD_SELECT]
     * @property {PayloadCardSelect} payload
     */
    /**
     * @typedef {Object} PayloadCardSelect
     * @property {String} [ACTIVE_CARD_ID_PROP]
     * @property {String} [WITHDRAW_CARD_ID_PROP]
     * @property {String} [PREPAID_CARD_ID_PROP]
     */
    case ACTION_CARD_SELECT:
      return {
        ...state,
        [ACTIVE_CARD_ID_PROP]: action.payload[ACTIVE_CARD_ID_PROP],
        [WITHDRAW_CARD_ID_PROP]: action.payload[WITHDRAW_CARD_ID_PROP],
        [PREPAID_CARD_ID_PROP]: action.payload[PREPAID_CARD_ID_PROP],
      };
  
    /**
     * @typedef {Object} ActionCardModeChange
     * @property {String} type [ACTION_CARD_MODE_CHANGE]
     * @property {PayloadCardModeChange} payload
     */
    /**
     * @typedef {Object} PayloadCardModeChange
     * @property {String} mode
     * @property {String} status
     */
    case ACTION_CARD_MODE_CHANGE:
      return {
        ...state,
        [action.payload.mode]: action.payload.status,
      };
  
    /**
     * @typedef {Object} ActionCardModeSuccess
     * @property {String} type [ACTION_CARD_MODE_SUCCESS]
     * @property {PayloadCardModeSuccess} payload
     */
    /**
     * @typedef {Object} PayloadCardModeSuccess
     * @property {String} mode
     * @property {Array} cards
     * @property {Array} transactions
     */
    case ACTION_CARD_MODE_SUCCESS:
      return {
        ...action.payload.cards.reduce((currState, card) => update(currState, card), state),
        [action.payload.mode]: SUCCESS,
      };
      
    default:
      return state;
  }
};

/**
 * Reads cards from server list
 * @param { Object } state
 * @param { Array } list
 * @returns { Object }
 */
export function readCards(state, list) {
  const _state = read(state, list);
  return {
    ..._state,
    [ACTIVE_CARD_ID_PROP]: _state.keys.length >= 0 ? _state.keys[0] : -1,
    [WITHDRAW_CARD_ID_PROP]: _state.keys.length >= 1 ? _state.keys[1] : -1,
    [PREPAID_CARD_ID_PROP]: _state.keys.length >= 1 ? _state.keys[1] : -1,
    [PAYMENT_MOBILE_MODE]: OFF,
    [WITHDRAW_CARD_MODE]: OFF,
    [PREPAID_CARD_MODE]: OFF,
  };
}
