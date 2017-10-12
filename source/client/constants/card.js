import { API_PREFIX, POST, contentType } from './util';

// api

export const API_CARD_PAY = {
  url: `${API_PREFIX}/cards/{cardId}/pay`,
  method: POST,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
};

export const API_CARD_FILL = {
  url: `${API_PREFIX}/cards/{cardId}/fill`,
  method: POST,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
};

export const API_CARD_TRANSFER = {
  url: `${API_PREFIX}/cards/{cardId}/transfer`,
  method: POST,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
};

// actions

export const ACTION_CARD_PAY_RESET = 'ACTION_CARD_PAY_RESET';
export const ACTION_CARD_PAY_PENDING = 'ACTION_CARD_PAY_PENDING';
export const ACTION_CARD_PAY_SUCCESS = 'ACTION_CARD_PAY_SUCCESS';
export const ACTION_CARD_PAY_FORBIDDEN = 'ACTION_CARD_PAY_FORBIDDEN';
export const ACTION_CARD_PAY_ERROR = 'ACTION_CARD_PAY_ERROR';

export const ACTION_CARD_FILL_RESET = 'ACTION_CARD_PAY_RESET';
export const ACTION_CARD_FILL_PENDING = 'ACTION_CARD_FILL_PENDING';
export const ACTION_CARD_FILL_SUCCESS = 'ACTION_CARD_FILL_SUCCESS';
export const ACTION_CARD_FILL_FORBIDDEN = 'ACTION_CARD_FILL_FORBIDDEN';
export const ACTION_CARD_FILL_ERROR = 'ACTION_CARD_FILL_ERROR';

export const ACTION_CARD_TRANSFER_RESET = 'ACTION_CARD_PAY_RESET';
export const ACTION_CARD_TRANSFER_PENDING = 'ACTION_CARD_TRANSFER_PENDING';
export const ACTION_CARD_TRANSFER_SUCCESS = 'ACTION_CARD_TRANSFER_SUCCESS';
export const ACTION_CARD_TRANSFER_FORBIDDEN = 'ACTION_CARD_TRANSFER_FORBIDDEN';
export const ACTION_CARD_TRANSFER_ERROR = 'ACTION_CARD_TRANSFER_ERROR';
