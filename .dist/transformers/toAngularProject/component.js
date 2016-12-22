'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.template = template;
exports.style = style;
exports.directive = directive;
exports.factory = factory;
function template(component) {
  return '<h1 class="unmodified-component">' + component.name + '</h1><div class="children">' + component.components.map(function (_ref) {
    var name = _ref.name;
    return '<' + name + '></' + name + '>';
  }).join('') + '</div>';
}

function style(component) {
  return component.name + ' { flex: 1; }\n';
}

function directive(component) {
  return 'module.exports = () => ({\n  restrict: \'E\',\n  template: require(\'./template.html\'),\n  controller: [\'$scope\', $scope => {\n\n  }]\n});';
}

function factory(project) {
  return 'module.exports = () => ({\n\n});';
}

var index = exports.index = function index(component) {
  return '<!DOCTYPE html>\n<html ng-app="' + component.rootModule + '">\n  <head>\n    <meta charset="utf-8">\n\n    <title>' + component.name + '</title>\n\n    <!-- Do we want this? -->\n    <meta name="viewport" content="width=device-width, initial-scale=1">\n    <!-- Place favicon.ico and apple-touch-icon.png in the root directory -->\n\n    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.4.0/css/font-awesome.min.css">\n\n    <link rel="stylesheet" href="app.css">\n  </head>\n  <body>\n    <ng-view></ng-view>\n    <script src="vendor.js"></script>\n    <script src="app.js"></script>\n  </body>\n</html>\n';
};

var moduleIndex = exports.moduleIndex = function () {
  var onNewLineIfExists = function onNewLineIfExists(value) {
    return value ? '\n' + value : '';
  };
  var printComponents = function printComponents(indent, components) {
    return '' + (components || []).map(function (_ref2) {
      var name = _ref2.name,
          path = _ref2.path,
          components = _ref2.components;
      return indent + '.directive(\'' + camelCase(name) + '\',' + Array(Math.max(1, 33 - name.length - indent.length)).join(' ') + 'require(\'' + path + '\'))' + onNewLineIfExists(printComponents(indent + '  ', components));
    }).join('\n');
  };

  var printFactories = function printFactories(indent, factories) {
    return '' + (factories || []).map(function (_ref3) {
      var name = _ref3.name,
          path = _ref3.path,
          factories = _ref3.factories;
      return indent + '.factory(\'' + camelCase(name) + '\',' + Array(Math.max(1, 33 - name.length - indent.length)).join(' ') + 'require(\'' + path + '\'))' + onNewLineIfExists(printFactories(indent + '  ', factories));
    }).join('\n');
  };

  var printConfigs = function printConfigs(indent, configs) {
    return '' + (configs || []).map(function (config) {
      return indent + '.config(require(\'./' + config + '\').default)';
    }).join('\n');
  };

  return function (_ref4) {
    var name = _ref4.name,
        requirements = _ref4.requirements,
        components = _ref4.components,
        factories = _ref4.factories,
        routes = _ref4.routes,
        configs = _ref4.configs;
    return autoGenerateWarning('require(\'angular\');\n\n' + (requirements || []).map(function (_ref5) {
      var jsPackageName = _ref5.jsPackageName,
          moduleName = _ref5.moduleName;
      return 'require(\'' + (jsPackageName || '../' + moduleName) + '\');';
    }).join('\n') + '\n\nexport default {\n  \'' + name + '\': angular.module(\'' + name + '\', [' + (requirements || []).map(function (_ref6) {
      var moduleName = _ref6.moduleName;
      return '\'' + moduleName + '\'';
    }).join(', ') + '])\n' + printComponents('    ', components) + '\n' + printFactories('    ', factories) + '\n' + printConfigs('    ', configs) + '\n};');
  };
}();

var createRoutes = exports.createRoutes = function createRoutes(routes) {
  return autoGenerateWarning(
  // autogenerateWarning`
  // export default ...
  // `
  'export default [\'$routeProvider\', $routeProvider => {\n  const routerController = [\n    \'$scope\', \'$routeParams\',\n    ($scope, $routeParams) => Object.assign($scope, $routeParams)\n  ];\n\n  // Allows you to wire a route to a specific item in a database.\n  // Currently, this is equivalent to grabbing a value from a\n  // key-value store based on a user provided parameter in the URL\n  const dataController = [\n    \'$scope\', \'$routeParams\', \'dataStore\',\n    ($scope, $routeParams, dataStore) => {\n      const something = reduce($routeParams, (params, value, name) => {\n        const [store, index] = name.match(/(\\b|[A-Z]+)[a-z]*/g);\n\n        console.log({name, value, store, index});\n\n        params[store] = dataStore[' + '`get${capitalize(store)}By${index}`' + '](value);\n\n        return params;\n      });\n\n      console.log({$scope, dataStore, something});\n\n      Object.assign($scope, something);\n\n      function capitalize(string) {\n        return string.charAt(0).toUpperCase() + string.slice(1);\n      }\n    }\n  ];\n\n  $routeProvider\n' + routes.map(function (route) {
    return '      .when(\'' + route.path + '\', {\n      template: \'<' + route.name + '></' + route.name + '>\'' + (route.path.indexOf(':') >= 0 ? ',\n      controller: dataController' : '') + '\n    })';
  }).join('\n') + '\n    .otherwise({\n      template: \'Where\\\'d you come from?\'\n    });\n\n  function reduce(list, fn, initial = {}) {\n    let state = initial;\n    for (let key in list) state = fn(state, list[key], key);\n    return state;\n  }\n}];');
};

var createConfigs = exports.createConfigs = function createConfigs(config) {
  return 'export default [() => {\n\n}];';
};

var createApp = exports.createApp = function createApp(_ref7) {
  var rootModule = _ref7.rootModule;
  return autoGenerateWarning('\nimport ' + rootModule + ' from \'./modules/' + rootModule + '\';\n\nexport default {\n  \'' + rootModule + '\': ' + rootModule + '[\'' + rootModule + '\']\n};\n');
};

function autoGenerateWarning(string) {
  return '/* !!!!!!! This file is autogenerated. DO NOT MODIFY !!!!!!! */\n' + string + '\n/* !!!!!!! This file is autogenerated. DO NOT MODIFY !!!!!!! */';
}

var SPECIAL_CHARS_REGEXP = /([\:\-\_]+(.))/g;
var MOZ_HACK_REGEXP = /^moz([A-Z])/;

function camelCase(name) {
  return name.replace(SPECIAL_CHARS_REGEXP, function (_, separator, letter, offset) {
    return offset ? letter.toUpperCase() : letter;
  }).replace(MOZ_HACK_REGEXP, 'Moz$1');
}