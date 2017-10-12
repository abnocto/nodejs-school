import {
  API_CARD_PAY,
  ACTION_CARD_PAY_RESET,
  ACTION_CARD_PAY_PENDING,
  ACTION_CARD_PAY_SUCCESS,
  ACTION_CARD_PAY_FORBIDDEN,
  ACTION_CARD_PAY_ERROR,
} from '../constants/card';
import { CODE_SUCCESS, CODE_FORBIDDEN } from '../constants/util';
import { completeURL } from '../service/urlService';

export const reset = () => ({ type: ACTION_CARD_PAY_RESET });

export const pay = (cardId, transaction) => async (dispatch) => {
  dispatch({
    type: ACTION_CARD_PAY_PENDING,
    payload: cardId,
  });
  
  try {
    const res = await fetch(completeURL(API_CARD_PAY.url, cardId), {
      method: API_CARD_PAY.method,
      headers: API_CARD_PAY.headers,
      body: JSON.stringify(transaction),
    });
  
    switch (res.status) {
      case CODE_SUCCESS: {
        const data = await res.json();
        dispatch({ type: ACTION_CARD_PAY_SUCCESS, payload: data });
        break;
      }
      
      case CODE_FORBIDDEN:
        dispatch({ type: ACTION_CARD_PAY_FORBIDDEN, payload: cardId });
        break;
    
      default:
        dispatch({ type: ACTION_CARD_PAY_ERROR, payload: cardId });
        break;
    }
  } catch (err) {
    dispatch({ type: ACTION_CARD_PAY_ERROR, payload: cardId });
  }
};
