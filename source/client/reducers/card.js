import {
  getInitialState,
  update,
} from '../service/objectService';
import {
  ACTION_CARD_PAY_RESET,
  ACTION_CARD_PAY_PENDING,
  ACTION_CARD_PAY_SUCCESS,
  ACTION_CARD_PAY_FORBIDDEN,
  ACTION_CARD_PAY_ERROR,
} from '../constants/card';

export default (state = getInitialState(), action) => {
  switch (action.type) {
    case ACTION_CARD_PAY_RESET:
      return { ...state, payMode: '' };
      
    case ACTION_CARD_PAY_PENDING:
      return { ...state, payMode: 'pending' };
    
    case ACTION_CARD_PAY_SUCCESS: {
      const _state = update(state, action.payload.card);
      return { ..._state, payMode: 'success' };
    }
    
    case ACTION_CARD_PAY_FORBIDDEN:
      return { ...state, payMode: 'forbidden' };
      
    case ACTION_CARD_PAY_ERROR:
      return { ...state, payMode: 'error' };
      
    default:
      return state;
  }
};
