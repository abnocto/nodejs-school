'use strict';

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
		return await this.readFile();
	}

	/**
	 * Removes all objects from file
	 * @returns {Promise.<void>}
	 */
	async removeAll() {
		this._dataSource = [];
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
					} catch(err) {
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
			} catch(err) {
				reject(err);
			}
		});
	}

}

module.exports = FileModel;
