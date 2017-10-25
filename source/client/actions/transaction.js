import {
  API_TRANSACTION_HISTORY,
  ACTION_TRANSACTION_HISTORY,
  OFF, PENDING, ERROR,
} from '../constants/transaction';
import {
  CODE_SUCCESS,
} from '../constants/util';
import { completeURL } from '../service/urlService';
import { downloadFile } from '../service/fileService';

/**
 * @param {Number} cardId
 */
export const getHistory = cardId => async (dispatch) => {
  dispatch({
    type: ACTION_TRANSACTION_HISTORY,
    payload: {
      status: PENDING,
    },
  });
  
  try {
    const res = await fetch(completeURL(API_TRANSACTION_HISTORY.url, cardId), {
      method: API_TRANSACTION_HISTORY.method,
    });
    
    switch (res.status) {
      case CODE_SUCCESS: {
        
        const text = await res.text();
        
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const filename = `${day}-${month}-${year}-transactions-history.csv`;
        
        const type = 'text/csv';
        
        downloadFile(text, filename, type);
  
        dispatch({
          type: ACTION_TRANSACTION_HISTORY,
          payload: {
            status: OFF,
          },
        });
        
        break;
      }
      
      default:
        dispatch({
          type: ACTION_TRANSACTION_HISTORY,
          payload: {
            status: ERROR,
          },
        });
        break;
    }
  } catch (err) {
    dispatch({
      type: ACTION_TRANSACTION_HISTORY,
      payload: {
        status: ERROR,
      },
    });
  }
};
