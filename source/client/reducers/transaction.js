import {
  getInitialState,
  create,
} from '../service/objectService';
import {
  ACTION_CARD_PAY_RESET,
  ACTION_CARD_PAY_SUCCESS,
} from '../constants/card';

export default (state = getInitialState(), action) => {
  switch (action.type) {
    case ACTION_CARD_PAY_RESET:
      return { ...state, payTransaction: null };
      
    case ACTION_CARD_PAY_SUCCESS: {
      const _state = create(state, action.payload.transaction);
      return { ..._state, payTransaction: action.payload.transaction };
    }
    
    default:
      return state;
  }
};
