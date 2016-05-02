'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _util = require('./util');

exports.default = {
  ListOf_some(element, separator, rest) {
    return [element.toObject()].concat(rest.toObject());
  },

  CContained(open, element, close) {
    return element.toObject();
  },

  Application(name, modules) {
    return (0, _util.join)({ name, modules });
  },

  Module: (name, elements) => (0, _util.join)(Object.assign({ name }, reduce(elements.toObject(), (obj, element) => Object.assign(obj, element)))),

  Requirements: (glyph, requirements) => (0, _util.join)({ requirements }),

  Requirement: (moduleName, jsPackageName) => (0, _util.join)({ moduleName, jsPackageName: (0, _util.first)(jsPackageName) }),
  JSPackage: (colon, jsPackageName) => jsPackageName.toObject(),

  Components: (glyph, components) => (0, _util.join)({ components }),

  Component: (name, components) => (0, _util.join)({ name, components: (0, _util.first)(components) || [] }),

  Routes: (glyph, routes) => (0, _util.join)({ routes }),

  Route: (path, colon, name) => (0, _util.join)({ path, name }),

  Factories: (glyph, factories) => (0, _util.join)({ factories }),

  Factory: (name, factories) => (0, _util.join)({ name, factories: (0, _util.first)(factories) || [] }),

  Configs: (glyph, configs) => {
    const obj = (0, _util.join)({ configs });
    if (obj.configs.length === 0) obj.configs.push('config');
    return obj;
  },

  name(character) {
    return this.interval.contents;
  },

  path(character) {
    return this.interval.contents;
  }
};

function reduce(xs, fn, initial = {}) {
  let next = initial;
  xs.forEach(x => next = fn(next, x));
  return next;
}
//# sourceMappingURL=AngularProject.toObject.semantics.js.map
