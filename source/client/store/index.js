import { createStore, combineReducers, applyMiddleware } from 'redux';
import { createLogger } from 'redux-logger';
import thunk from 'redux-thunk';
import { user, card, transaction } from '../reducers';

export default initialData => createStore(
  combineReducers({ user, card, transaction }),
  initialData,
  applyMiddleware(thunk, createLogger()),
);
