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
    const dbObjects = await this._getMongooseModel().find();
    return dbObjects.map(this._toClient);
  }
  
  /**
   * Returns db object by id
   * @param {Number} id Object id
   * @returns {Promise.<Object>}
   */
  async get(id) {
    const dbObject = await this._getMongooseModel().findOne({ id });
    return this._toClient(dbObject);
  }
  
  /**
   * Returns db objects list filtered by key and value
   * @param {String} key Property key
   * @param {String|Number} value
   * @returns {Promise.<Array>}
   */
  async getBy(key, value) {
    const dbObjects = await this._getMongooseModel().find({ [key]: value });
    return dbObjects.map(this._toClient);
  }
  
  /**
   * Removes db object by id
   * @param {Number} id Object id
   * @returns {Promise.<void>}
   */
  async remove(id) {
    const dbObject = await this._getMongooseModel().findOneAndRemove({ id });
    if (!dbObject) logger.warn(`remove(id) with ${id}: object was NOT found by id, object was NOT removed`);
  }
  
  /**
   * Creates new db object by data
   * @param {Object} data Data to create object with
   * @returns {Promise.<Object>}
   */
  async create(data) {
    const dbObject = await this._getMongooseModel().create(data);
    return this._toClient(dbObject);
  }
  
  /**
   * Updates db object
   * @param {Object} object Object to update
   * @returns {Promise.<Object>}
   */
  async update(object) {
    const dbObject = await this._getMongooseModel().findOneAndUpdate({ id: object.id }, object, { new: true });
    if (!dbObject) {
      logger.warn(`update(object) with id ${object.id}: object was NOT found by id, object was NOT updated`);
      return object;
    }
    return this._toClient(dbObject);
  }
  
  _getMongooseModel() {
    return this._mongooseModel;
  }
  
}

module.exports = MongooseModel;
