const { Readable } = require('stream');

class MockStream extends Readable {
  constructor(data) {
    super({ objectMode: true });
    this.data = data;
  }
  _read() {
    this.push(this.data.length ? this.data.shift() : null);
  }
}

module.exports = class Model {
  
  constructor(objects) {
    this._initObjects = objects;
    this._objects = JSON.parse(JSON.stringify(this._initObjects));
    this._temp = null;
  }
  
  reset() {
    this._objects = JSON.parse(JSON.stringify(this._initObjects));
  }
  
  find(selector) {
    this._temp = this._getData(selector);
    return this;
  }
  
  cursor() {
    const stream = new MockStream(this._temp);
    this._temp = null;
    return stream;
  }
  
  findOne(selector) {
    const data = this._getData(selector);
    return data.length ? data[0] : null;
  }
  
  findOneAndRemove(selector) {
    const obj = this._getData(selector)[0];
    if (!obj) return;
    const index = this._objects.findIndex(_obj => _obj.id === obj.id);
    this._objects.splice(index, 1);
  }
  
  findOneAndUpdate(selector, rule) {
    const obj = this._getData(selector)[0];
    if (!obj) return;
    const index = this._objects.findIndex(_obj => _obj.id === obj.id);
    if (rule.$set) {
      this._objects[index] = Object.assign({}, this._objects[index], rule.$set);
    } else {
      this._objects[index] = rule;
    }
  }
  
  create(data) {
    const obj = Object.assign(
      {},
      data,
      {
        id: Math.max(...this._objects.map(obj => obj.id), 0) + 1,
      },
    );
    this._objects.push(obj);
    return obj;
  }
  
  _getData(selector) {
    if (!selector) return this._objects;
    const [key] = Object.keys(selector);
    if (!key) return this._objects;
    const value = selector[key];
    return this._objects.filter(obj => obj[key] === value);
  }
  
};

