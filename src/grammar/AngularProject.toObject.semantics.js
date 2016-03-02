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

  Module: (name, elements) => join({name, elements}),

  Requirements: (glyph, requirements) => join({requirements}),

  Components: (glyph, components) => join({components}),

  Component: (name, components) => join({name, components: first(components) || []}),

  Routes: (glyph, routes) => join({routes}),

  Route: (path, colon, name) => join({path, name}),

  Factories: (glyph, factories) => join({factories}),

  Factory: (name) => join({name}),

  name (character) {
    return this.interval.contents;
  }
};