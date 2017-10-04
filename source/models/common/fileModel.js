const fs = require('fs');
const path = require('path');

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
    return await this._readFile();
  }

  /**
   * Returns file object by id
   * @param {Number} id Object id
   * @returns {Promise.<Object>}
   */
  async get(id) {
    const objects = await this._readFile();
    return objects.find(_object => _object.id === id);
  }

  /**
   * Returns file objects by Foreign key (property name and id)
   * @param {String} name Property name
   * @param {Number} id Foreign key (id)
   * @returns {Promise.<Array>}
   */
  async getBy(name, id) {
    const objects = await this._readFile();
    return objects.filter(_object => _object[name] === id);
  }

  /**
   * Removes file object by id
   * @param {Number} id Object id
   * @returns {Promise.<void>}
   */
  async remove(id) {
    const objects = await this._readFile();
    const objectIndex = objects.findIndex(_object => _object.id === id);
    objects.splice(objectIndex, 1);
    await this._writeFile();
  }
  
  /**
   * Creates new object by data
   * @param {Object} data Data to create object with
   * @returns {Promise.<Object>}
   */
  async create(data) {
    const objects = await this._readFile();
    const object = Object.assign(
      {},
      data,
      { id: Math.max(...Object.values(objects).map(_object => _object.id), 0) + 1 },
    );
    objects.push(object);
    await this._writeFile();
    return object;
  }

  /**
   * Reads data from file
   * @returns {Promise.<Array>}
   */
  _readFile() {
    return new Promise((resolve, reject) => {
      if (this._dataSource) resolve(this._dataSource);
      fs.readFile(this._dataSourceFilePath, (err, dataJSON) => {
        if (err) {
          reject(err);
        } else {
          try {
            this._dataSource = JSON.parse(dataJSON);
            resolve(this._dataSource);
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
