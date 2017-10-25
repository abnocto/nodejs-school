class Model {
  /**
   * Returns all objects list
   * @returns {Promise}
   */
  async getAll() {}

  /**
   * Returns object by Primary key (id)
   * @param {Number} id Primary key (id)
   * @returns {Promise}
   */
  async get(id) {}
  
  /**
   * Returns file objects list filtered by key and value
   * @param {String} key Property key
   * @param {String|Number} value
   * @returns {Promise}
   */
  async getBy(key, value) {}

  /**
   * Creates new object by data
   * @param data Data to create object with
   * @returns {Promise}
   */
  async create(data) {}
  
  /**
   * Updates object
   * @param {Number} id Object id
   * @param {Object} object Object to update
   * @param {Boolean} isSet Sets props from `object` to object or replace full object with `object`
   * @returns {Promise}
   */
  async update(id, object, isSet) {}
  
  /**
   * Removes object by id
   * @param {Number} id Object id
   * @returns {Promise}
   * */
  async remove(id) {}
}

module.exports = Model;
