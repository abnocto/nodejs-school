const log4js = require('log4js');

// create stubs for logger
const loggerMethods = ['info', 'warn', 'error'];
log4js.getLogger = jest.fn(() => loggerMethods.reduce((obj, key) => Object.assign(obj, { [key]: jest.fn() }), {}));

// create stubs for console
const consoleMethods = ['log', 'error'];
consoleMethods.forEach(method => console[method] = jest.fn()); // eslint-disable-line no-console

// ssl
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
