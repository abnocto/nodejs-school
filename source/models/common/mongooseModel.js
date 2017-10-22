const Model = require('./model');
const logger = require('../../../libs/logger')('MongooseModel');

class MongooseModel extends Model {
  constructor(mongooseModel, toClient) {
    super();
    this._mongooseModel = mongooseModel;
    this._toClient = toClient;
  }
  
  /**
   * Returns all db objects list
   * @returns {Promise.<Array>}
   */
  async getAll() {
    return (await this._getMongooseModel().find()).map(this._toClient);
  }
  
  /**
   * Returns db object by id
   * @param {Number} id Object id
   * @returns {Promise.<Object>}
   */
  async get(id) {
    try {
      return this._toClient(await this._getMongooseModel().findById(id));
    } catch (err) {
      logger.error(`get(id) with ${id}: ${err.message}; object was NOT found`);
      return null;
    }
  }
  
  /**
   * Returns db objects list filtered by key and value
   * @param {String} key Property key
   * @param {String|Number} value
   * @returns {Promise.<Array>}
   */
  async getBy(key, value) {
    try {
      return (await this._getMongooseModel().find({ [key]: value })).map(this._toClient);
    } catch (err) {
      logger.error(`getBy(key, value) with ${key} and ${value}: ${err.message}; empty array returns`);
      return [];
    }
  }
  
  /**
   * Removes db object by id
   * @param {Number} id Object id
   * @returns {Promise.<void>}
   */
  async remove(id) {
    try {
      await this._getMongooseModel().findByIdAndRemove(id);
    } catch (err) {
      logger.error(`remove(id) with ${id}: ${err.message}; object was NOT removed`);
    }
  }
  
  /**
   * Creates new db object by data
   * @param {Object} data Data to create object with
   * @returns {Promise.<Object>}
   */
  async create(data) {
    return this._toClient(await this._getMongooseModel().create(data));
  }
  
  /**
   * Updates db object
   * @param {Object} object Object to update
   * @returns {Promise.<Object>}
   */
  async update(object) {
    try {
      const dbObject = await this._getMongooseModel().findByIdAndUpdate(object.id, object, { new: true });
      if (!dbObject) {
        logger.error(`update(object) with id ${object.id}: object was not found by id, object was NOT updated`);
        return object;
      }
      return this._toClient(dbObject);
    } catch (err) {
      logger.error(`update(object): ${err.message}; object was NOT updated`);
      return object;
    }
  }
  
  _getMongooseModel() {
    return this._mongooseModel;
  }
  
}

module.exports = MongooseModel;
