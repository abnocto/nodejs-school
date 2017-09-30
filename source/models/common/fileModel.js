const fs = require('fs');
const path = require('path');

const AppError = require('../../../libs/appError');
const Model = require('./model');

class FileModel extends Model {
  constructor(dataSourceFilePath) {
    super();
    this._dataSourceFilePath = path.join(__dirname, '..', '..', 'data', dataSourceFilePath);
    this._dataSource = null;
  }

  /**
   * Returns all file objects list
   * @returns {Promise.<Array>}
   */
  async getAll() {
    return await this.readFile();
  }

  /**
   * Returns file object by id
   * @param {Number} id Object id
   * @returns {Promise.<Object>}
   */
  async get(id) {
    if (!Number.isInteger(id) || id <= 0) {
      throw new AppError(400, 'Bad request: Id must be a positive integer');
    }

    const obj = this._dataSource.find(_obj => _obj.id === id);
    if (obj) {
      return obj;
    }

    throw new AppError(404, `Not found: Wasn't found by id ${id}`);
  }

  /**
   * Returns file objects by Foreign key (property name and id)
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

    return this._dataSource.filter(_obj => _obj[name] === id);
  }

  /**
   * Removes file object by id
   * @param {Number} id Object id
   * @returns {Promise.<void>}
   */
  async remove(id) {
    if (!Number.isInteger(id) || id <= 0) {
      throw new AppError(400, 'Bad request: Id must be a positive integer');
    }

    const objIndex = this._dataSource.findIndex(_obj => _obj.id === id);
    if (objIndex === -1) {
      throw new AppError(404, `Not found: Wasn't found by id ${id}`);
    }

    this._dataSource.splice(objIndex, 1);
    await this._writeFile();
  }

  /**
   * Reads data from file
   * @returns {Promise.<Array>}
   */
  readFile() {
    return new Promise((resolve, reject) => {
      if (this._dataSource) resolve(this._dataSource);
      fs.readFile(this._dataSourceFilePath, (err, dataJSON) => {
        if (err) {
          reject(err);
        } else {
          try {
            const data = JSON.parse(dataJSON);
            this._dataSource = data;
            resolve(data);
          } catch (err) {
            reject(err);
          }
        }
      });
    });
  }

  /**
   * Saves updates to file
   * @returns {Promise.<void>}
   * @private
   */
  _writeFile() {
    return new Promise((resolve, reject) => {
      try {
        const dataJSON = JSON.stringify(this._dataSource);
        fs.writeFile(this._dataSourceFilePath, dataJSON, (err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      } catch (err) {
        reject(err);
      }
    });
  }
}

module.exports = FileModel;
