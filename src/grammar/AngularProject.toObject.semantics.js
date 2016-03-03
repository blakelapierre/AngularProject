import {join, first} from './util';


export default {
  ListOf_some (element, separator, rest) {
    return [element.toObject()].concat(rest.toObject());
  },

  CContained (open, element, close) {
    return element.toObject();
  },

  Application (name, modules) {
    return join({name, modules});
  },

  Module: (name, elements) => join(Object.assign({name}, reduce(elements.toObject(), (obj, element) => Object.assign(obj, element)))),

  Requirements: (glyph, requirements) => join({requirements}),

  Requirement: (moduleName, jsPackageName) => join({moduleName, jsPackageName: first(jsPackageName)}),
  JSPackage: (colon, jsPackageName) => jsPackageName.toObject(),

  Components: (glyph, components) => join({components}),

  Component: (name, components) => join({name, components: first(components) || []}),

  Routes: (glyph, routes) => join({routes}),

  Route: (path, colon, name) => join({path, name}),

  Factories: (glyph, factories) => join({factories}),

  Factory: (name, factories) => join({name, factories: first(factories) || []}),

  Configs: (glyph, configs) => join({configs}),

  name (character) {
    return this.interval.contents;
  },

  path (character) {
    return this.interval.contents;
  }
};

function reduce(xs, fn, initial = {}) {
  let next = initial;
  xs.forEach(x => next = fn(next, x));
  return next;
}