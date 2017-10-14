import { API_PREFIX, POST, JSON_HEADERS } from './util';

// api
export const API_CARD_PAY = {
  url: `${API_PREFIX}/cards/{cardId}/pay`,
  method: POST,
  headers: JSON_HEADERS,
};

export const API_CARD_FILL = {
  url: `${API_PREFIX}/cards/{cardId}/fill`,
  method: POST,
  headers: JSON_HEADERS,
};

export const API_CARD_TRANSFER = {
  url: `${API_PREFIX}/cards/{cardId}/transfer`,
  method: POST,
  headers: JSON_HEADERS,
};

// actions
export const ACTION_CARD_SELECT = 'ACTION_CARD_SELECT';
export const ACTION_CARD_MODE_CHANGE = 'ACTION_CARD_MODE_CHANGE';
export const ACTION_CARD_MODE_SUCCESS = 'ACTION_CARD_MODE_SUCCESS';

// selected cards ids properties
export const ACTIVE_CARD_ID_PROP = 'activeCardId';
export const WITHDRAW_CARD_ID_PROP = 'withdrawCardId';
export const PREPAID_CARD_ID_PROP = 'prepaidCardId';

// modes
export const PAYMENT_MOBILE_MODE = 'payMode';
export const WITHDRAW_CARD_MODE = 'withdrawMode';
export const PREPAID_CARD_MODE = 'prepaidMode';

// mode statuses
export const OFF = 'OFF';
export const PENDING = 'PENDING';
export const SUCCESS = 'SUCCESS';
export const FORBIDDEN = 'FORBIDDEN';
export const ERROR = 'ERROR';
