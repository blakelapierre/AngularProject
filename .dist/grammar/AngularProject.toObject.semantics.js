'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _util = require('./util');

exports.default = {
  ListOf_some: function ListOf_some(element, separator, rest) {
    return [element.toObject()].concat(rest.toObject());
  },
  CContained: function CContained(open, element, close) {
    return element.toObject();
  },
  Application: function Application(name, modules) {
    return (0, _util.join)({ name: name, modules: modules });
  },


  Module: function Module(name, elements) {
    return (0, _util.join)(Object.assign({ name: name }, reduce(elements.toObject(), function (obj, element) {
      return Object.assign(obj, element);
    })));
  },

  Requirements: function Requirements(glyph, requirements) {
    return (0, _util.join)({ requirements: requirements });
  },

  Requirement: function Requirement(moduleName, jsPackageName) {
    return (0, _util.join)({ moduleName: moduleName, jsPackageName: (0, _util.first)(jsPackageName) });
  },
  JSPackage: function JSPackage(colon, jsPackageName) {
    return jsPackageName.toObject();
  },

  Components: function Components(glyph, components) {
    return (0, _util.join)({ components: components });
  },

  Component: function Component(name, components) {
    return (0, _util.join)({ name: name, components: (0, _util.first)(components) || [] });
  },

  Routes: function Routes(glyph, routes) {
    return (0, _util.join)({ routes: routes });
  },

  Route: function Route(path, colon, name) {
    return (0, _util.join)({ path: path, name: name });
  },

  Factories: function Factories(glyph, factories) {
    return (0, _util.join)({ factories: factories });
  },

  Factory: function Factory(name, factories) {
    return (0, _util.join)({ name: name, factories: (0, _util.first)(factories) || [] });
  },

  Filters: function Filters(glyph, filters) {
    return (0, _util.join)({ filters: filters });
  },

  Filter: function Filter(name, filters) {
    return (0, _util.join)({ name: name, filters: (0, _util.first)(filters) || [] });
  },

  Configs: function Configs(glyph, configs) {
    var obj = (0, _util.join)({ configs: configs });
    if (obj.configs.length === 0) obj.configs.push('config');
    return obj;
  },

  name: function name(character) {
    return this.interval.contents;
  },
  path: function path(character) {
    return this.interval.contents;
  }
};


function reduce(xs, fn) {
  var initial = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  var next = initial;
  xs.forEach(function (x) {
    return next = fn(next, x);
  });
  return next;
}