const FileModel = require('./common/fileModel');

class CardsModel extends FileModel {
  constructor() {
    super('cards.json');
  }
}

module.exports = CardsModel;
