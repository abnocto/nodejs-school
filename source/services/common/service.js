const AppError = require('../../../libs/appError');

class Service {
  constructor(model) {
    this._model = model;
  }
  
  /**
   * Returns all objects list
   * @returns {Promise.<Array>}
   */
  async getAll() {
    return await this._getModel().getAll();
  }
  
  /**
   * Returns object by Primary key (id)
   * @param {String} id Primary key
   * @returns {Promise.<Object>}
   */
  async get(id) {
    if (!id || typeof id !== 'string') {
      throw new AppError(400, 'Bad request: Id must be a string');
    }
    
    const object = await this._getModel().get(id);
    if (!object) {
      throw new AppError(404, `Not found: Wasn't found by id ${id}`);
    }
    
    return object;
  }
  
  /**
   * Returns objects list filtered by key and value
   * @param {String} key Property key
   * @param {String|Number} value
   * @returns {Promise}
   */
  async getBy(key, value) {
    if (typeof key !== 'string') {
      throw new AppError(400, 'Bad request: Key must be a string');
    }
  
    if (typeof value !== 'string' && typeof value !== 'number') {
      throw new AppError(400, 'Bad request: Value must be a string or a number');
    }
  
    return await this._getModel().getBy(key, value);
  }
  
  /**
   * Removes object by id
   * @param {String} id Object id
   * @returns {Promise.<void>}
   */
  async remove(id) {
    if (!id || typeof id !== 'string') {
      throw new AppError(400, 'Bad request: Id must be a string');
    }
    
    const object = await this._getModel().get(id);
    if (!object) {
      throw new AppError(404, `Not found: Wasn't found by id ${id}`);
    }
    
    await this._getModel().remove(id);
  }
  
  /**
   * Creates new object by data
   * @param data Data to create object with
   * @returns {Promise.<Object>}
   */
  async create(data) {}
  
  /**
   * Returns model object
   * @returns {Object}
   * @private
   */
  _getModel() {
    return this._model;
  }
}

module.exports = Service;
