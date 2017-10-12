import React from 'react';
import { Provider } from 'react-redux';
import { renderToString } from 'react-dom/server';
import { extractCritical } from 'emotion-server';
import serialize from 'serialize-javascript';
import { App } from '../client/components';
import configureStore from '../client/store';

module.exports = (appData) => {
  const store = configureStore(appData);
  
  const app = renderToString(
    <Provider store={store}>
      <App />
    </Provider>,
  );
  
  const { ids, html, css } = extractCritical(app);
  
  const data = `window.__INITIAL_DATA__ = ${serialize({ ids, appData })};`;
  
  return (
    <html>
      <head>
        <meta charSet='utf-8' />
        <link rel='shortcut icon' href='/favicon.ico' />
        <link rel='stylesheet' href='/index.css' />
        <style
          type='text/css'
          dangerouslySetInnerHTML={{ __html: css }}
        />
        <title>Wallet App</title>
      </head>
      <body>
        <div
          id='root'
          dangerouslySetInnerHTML={{ __html: html }}
        />
        <script
          dangerouslySetInnerHTML={{ __html: data }}
        />
        <script src='/index.js' />
      </body>
    </html>
  );
};
