import React from 'react';
import { hydrate as reactHydrate } from 'react-dom';
import { hydrate as emotionHydrate } from 'emotion';
import { Provider } from 'react-redux';
import { App } from './components';
import configureStore from './store';

const { ids, appData } = window.__INITIAL_DATA__;

const store = configureStore(appData);

emotionHydrate(ids);

reactHydrate(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root'),
);
