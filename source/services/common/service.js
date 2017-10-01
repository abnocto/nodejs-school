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
   * @param {Number} id Primary key
   * @returns {Promise.<Object>}
   */
  async get(id) {
    if (!Number.isInteger(id) || id <= 0) {
      throw new AppError(400, 'Bad request: Id must be a positive integer');
    }
    
    const object = await this._getModel().get(id);
    if (!object) {
      throw new AppError(404, `Not found: Wasn't found by id ${id}`);
    }
    
    return object;
  }
  
  /**
   * Returns objects by Foreign key (property name and id)
   * @param {String} name Property name
   * @param {Number} id Foreign key (id)
   * @returns {Promise.<Array>}
   */
  async getBy(name, id) {
    if (typeof name !== 'string') {
      throw new AppError(400, 'Bad request: Name must be a string');
    }
  
    if (!Number.isInteger(id) || id <= 0) {
      throw new AppError(400, 'Bad request: Id must be a positive integer');
    }
  
    return await this._getModel().getBy(name, id);
  }
  
  /**
   * Removes object by id
   * @param {Number} id Object id
   * @returns {Promise.<void>}
   */
  async remove(id) {
    if (!Number.isInteger(id) || id <= 0) {
      throw new AppError(400, 'Bad request: Id must be a positive integer');
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
