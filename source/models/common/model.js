'use strict';

class Model {

	/**
	 * Returns all objects list
	 * @returns {Promise}
	 */
	async getAll() {}

	/**
	 * Returns object by id
	 * @param {Number} id Object id
	 * @returns {Object}
	 */
	async get(id) {}

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
	 */
	async remove(id) {}

	/**
	 * Removes all objects
	 * @returns {Promise}
	 */
	async removeAll() {}

}

module.exports = Model;
