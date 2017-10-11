import React from 'react';
import { renderToString } from 'react-dom/server';
import { extractCritical } from 'emotion-server';
import serialize from 'serialize-javascript';
import { App } from '../client/components';

module.exports = (appData) => {
  const app = renderToString(<App data={appData} />);
  const { ids, html, css } = extractCritical(app);
  const data = `window.__data = ${serialize({ ids, appData })};`;
  
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
