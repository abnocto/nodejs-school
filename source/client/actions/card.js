import {
  API_CARD_PAY,
  API_CARD_TRANSFER,
  ACTION_CARD_SELECT,
  ACTION_CARD_MODE_CHANGE,
  ACTION_CARD_MODE_SUCCESS,
  ACTIVE_CARD_ID_PROP,
  WITHDRAW_CARD_ID_PROP,
  PREPAID_CARD_ID_PROP,
  OFF, PENDING, FORBIDDEN, ERROR,
} from '../constants/card';
import {
  CODE_SUCCESS,
  CODE_FORBIDDEN,
} from '../constants/util';
import { completeURL } from '../service/urlService';

/**
 * @param {Object} api
 * @param {String} mode
 * @param {Number} cardId
 * @param {Object} data
 */
const cardAsyncUpdateOperation = (api, mode, cardId, data) => async (dispatch) => {
  dispatch({
    type: ACTION_CARD_MODE_CHANGE,
    payload: {
      mode,
      status: PENDING,
    },
  });
  
  try {
    const res = await fetch(completeURL(api.url, cardId), {
      method: api.method,
      headers: api.headers,
      body: JSON.stringify(data),
    });
  
    switch (res.status) {
      case CODE_SUCCESS: {
        const data = await res.json();
        dispatch({
          type: ACTION_CARD_MODE_SUCCESS,
          payload: {
            mode,
            cards: data.cards,
            transactions: data.transactions,
          },
        });
        break;
      }
      
      case CODE_FORBIDDEN:
        dispatch({
          type: ACTION_CARD_MODE_CHANGE,
          payload: {
            mode,
            status: FORBIDDEN,
          },
        });
        break;
    
      default:
        dispatch({
          type: ACTION_CARD_MODE_CHANGE,
          payload: {
            mode,
            status: ERROR,
          },
        });
        break;
    }
  } catch (err) {
    dispatch({
      type: ACTION_CARD_MODE_CHANGE,
      payload: {
        mode,
        status: ERROR,
      },
    });
  }
};

/**
 * @param {Number} activeCardId
 * @param {Number} withdrawCardId
 * @param {Number} prepaidCardId
 * @returns {ActionCardSelect}
 */
export const setActive = (activeCardId, withdrawCardId, prepaidCardId) => ({
  type: ACTION_CARD_SELECT,
  payload: {
    [ACTIVE_CARD_ID_PROP]: activeCardId,
    [WITHDRAW_CARD_ID_PROP]: withdrawCardId,
    [PREPAID_CARD_ID_PROP]: prepaidCardId,
  },
});

/**
 * @param {String} mode
 * @returns {ActionCardModeChange}
 */
export const reset = mode => ({
  type: ACTION_CARD_MODE_CHANGE,
  payload: {
    mode,
    status: OFF,
  },
});

/**
 * @param {String} mode
 * @param {Number} cardId
 * @param {Object} data
 */
export const pay = (mode, cardId, data) => cardAsyncUpdateOperation(API_CARD_PAY, mode, cardId, data);

/**
 * @param {String} mode
 * @param {Number} cardId
 * @param {Object} data
 */
export const transfer = (mode, cardId, data) => cardAsyncUpdateOperation(API_CARD_TRANSFER, mode, cardId, data);
