function pick(obj, keys) {
  const o = {};
  keys.forEach((key) => {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      o[key] = obj[key];
    }
  });
  return o;
}

module.exports.pick = pick;
