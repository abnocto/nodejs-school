import { API_PREFIX, GET } from './util';

// api
export const API_TRANSACTION_HISTORY = {
  url: `${API_PREFIX}/cards/{cardId}/file-transactions`,
  method: GET,
};

// actions
export const ACTION_TRANSACTION_HISTORY = 'ACTION_TRANSACTION_HISTORY';

// transaction types
export const PREPAID_CARD = 'prepaidCard';
export const WITHDRAW_CARD = 'card2Card';
export const PAYMENT_MOBILE = 'paymentMobile';

export const PREPAID_CARD_DESC = 'Пополнение с карты';
export const WITHDRAW_CARD_DESC = 'Перевод на карту';
export const PAYMENT_MOBILE_DESC = 'Оплата телефона';
export const DEFAULT_DESC = 'Операция';

// modes
export const PAYMENT_MOBILE_MODE_TRANSACTIONS = 'payModeTransactions';
export const WITHDRAW_CARD_MODE_TRANSACTIONS = 'withdrawModeTransactions';
export const PREPAID_CARD_MODE_TRANSACTIONS = 'prepaidModeTransactions';

// history statuses
export const OFF = 'OFF';
export const PENDING = 'PENDING';
export const ERROR = 'ERROR';
