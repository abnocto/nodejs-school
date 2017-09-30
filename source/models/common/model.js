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
   * Returns objects by Foreign key (property name and id)
   * @param {String} name Property name
   * @param {Number} id Foreign key (id)
   * @returns {Promise}
   */
  async getBy(name, id) {}

  /**
   * Creates new object by data
   * @param data Data to create object with
   * @returns {Promise}
   */
  async create(data) {}
  
  /**
   * Removes object by id
   * @param {Number} id Object id
   * @returns {Promise}
   * */
  async remove(id) {}
}

module.exports = Model;
