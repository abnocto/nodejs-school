module.exports = class Model {
  
  constructor(objects) {
    this._initObjects = objects;
    this._objects = JSON.parse(JSON.stringify(this._initObjects));
  }
  
  reset() {
    this._objects = JSON.parse(JSON.stringify(this._initObjects));
  }
  
  find(selector) {
    if (!selector) return this._objects;
    const [key] = Object.keys(selector);
    if (!key) return this._objects;
    const value = selector[key];
    return this._objects.filter(obj => obj[key] === value);
  }
  
  findOne(selector) {
    const objects = this.find(selector);
    return objects.length ? objects[0] : null;
  }
  
  findOneAndRemove(selector) {
    const obj = this.findOne(selector);
    if (!obj) return;
    const index = this._objects.findIndex(_obj => _obj.id === obj.id);
    this._objects.splice(index, 1);
  }
  
  findOneAndUpdate(selector, object) {
    const obj = this.findOne(selector);
    if (!obj) return null;
    const index = this._objects.findIndex(_obj => _obj.id === obj.id);
    this._objects[index] = object;
    return object;
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
  
};

