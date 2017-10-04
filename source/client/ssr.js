import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { App } from './components';

export default () => {
  const content = ReactDOMServer.renderToString(<App />);
  return `
    <html>
      <head>
        <meta charset='utf-8'>
        <link rel='shortcut icon' href='/favicon.ico'>
        <link rel='stylesheet' href='/styles.css'>
        <title>Wallet App</title>
      </head>
      <body>
        <div id='root'>${content}</div>
        <script src='/bundle.js'></script>
      </body>
    </html>
  `;
};
