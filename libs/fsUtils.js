'use strict';

const fs = require('fs');

const UTF8 = 'utf8';

const fsUtils = {

	writeFile(path, data, encoding) {
		return new Promise((resolve, reject) => {
			fs.writeFile( path, data, encoding || UTF8, (err) => {
				if (err) {
					reject(err);
				} else {
					resolve();
				}
			});
		});
	},

	readFile(path, encoding) {
		return new Promise((resolve, reject) => {
			fs.readFile(path, encoding || UTF8, (err, data) => {
				if (err) {
					reject(err);
				} else {
					resolve(data);
				}
			});
		});
	}

};

module.exports = fsUtils;
