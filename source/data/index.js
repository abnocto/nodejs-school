const mongoose = require('mongoose');
const config = require('../config');
const logger = require('../../libs/logger')('DATABASE');

const connect = async () => {
  mongoose.Promise = global.Promise;
  
  const isTesting = process.env.NODE_ENV === 'testing';
  const { host, port, name, options } = isTesting ? config.mongooseTest : config.mongoose;
  const uri = `mongodb://${host}:${port}/${name}`;
  
  try {
    await mongoose.connect(uri, options);
    logger.info(`Mongoose is connected: ${uri}`);
  } catch (err) {
    logger.error(`Mongoose error: ${err}`);
    process.exit(1);
  }
};

const disconnect = async () => {
  await mongoose.disconnect();
  logger.info('Mongoose is disconnected');
};

module.exports = {
  connect,
  disconnect,
};
