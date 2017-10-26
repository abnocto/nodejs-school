const Model = require('./model');
const logger = require('../../../libs/logger')('MongooseModel');

class MongooseModel extends Model {
  
  constructor(mongooseModel, transformers) {
    super();
    this._mongooseModel = mongooseModel;
    this._transformers = transformers;
  }
  
  /**
   * Returns all db objects list
   * @returns {Promise.<Array>}
   */
  async getAll() {
    const dbCursor = this._getMongooseModel().find().cursor();
    return await this._collect(dbCursor);
  }
  
  /**
   * Returns db object by id
   * @param {Number} id Object id
   * @returns {Promise.<Object>}
   */
  async get(id) {
    const dbCursor = this._getMongooseModel().find({ id }).cursor();
    const objects = await this._collect(dbCursor);
    return objects.length ? objects[0] : null;
  }
  
  /**
   * Returns db objects list filtered by key and value
   * @param {String} key Property key
   * @param {String|Number} value
   * @returns {Promise.<Array>}
   */
  async getBy(key, value) {
    const dbCursor = this._getMongooseModel().find({ [key]: value }).cursor();
    return await this._collect(dbCursor);
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
    return this.get(dbObject.id);
  }
  
  /**
   * Updates object
   * @param {Number} id Object id
   * @param {Object} object Object to update
   * @param {Boolean} isSet Sets props from `object` to object or replace full object with `object`
   * @returns {Promise}
   */
  async update(id, object, isSet) {
    const dbObject = await this._getMongooseModel().findOneAndUpdate({ id }, isSet ? { $set: object } : object, { new: true });
    if (!dbObject) logger.warn(`update(object) with id ${id}: object was NOT found by id, object was NOT updated`);
  }
  
  /**
   * Pipes database stream to model's transform streams
   * @param {Stream} dbCursor
   * @returns {Stream}
   * @private
   */
  _connect(dbCursor) {
    return this._getTransformers().reduce((stream, transformer) => stream.pipe(transformer()), dbCursor);
  }
  
  /**
   * Collects stream data
   * @param {Stream} dbCursor
   * @returns {Promise}
   * @private
   */
  _collect(dbCursor) {
    return new Promise((resolve, reject) => {
      const data = [];
      this._connect(dbCursor)
        .on('data', obj => data.push(obj))
        .on('error', reject)
        .on('end', () => resolve(data));
    });
  }
  
  /**
   * Returns Mongoose model instance
   * @returns {Object}
   * @private
   */
  _getMongooseModel() {
    return this._mongooseModel;
  }
  
  /**
   * Returns model transform streams list
   * @returns {Array}
   * @private
   */
  _getTransformers() {
    return this._transformers;
  }
  
}

module.exports = MongooseModel;
