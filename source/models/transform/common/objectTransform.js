const { Transform } = require('stream');

class ObjectTransform extends Transform {
  constructor() {
    super({ objectMode: true });
  }
}

module.exports = ObjectTransform;
