'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.join = join;
exports.first = first;
function join(obj) {
  for (let key in obj) {
    const value = obj[key];
    if (value === undefined) continue;else if (typeof value === 'function') obj[key] = value(o => o.toObject());else if (value.toObject) obj[key] = value.toObject();
  }
  return obj;
}

function first(obj) {
  return obj.toObject()[0];
}
//# sourceMappingURL=index.js.map
