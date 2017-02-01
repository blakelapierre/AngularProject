'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = toAngularProject;

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _component = require('./component');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function toAngularProject(project) {
  var directory = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : project.name;

  var projectRoot = '' + (process.env.project_root || directory),
      sourceRoot = _path2.default.join(projectRoot, 'src'),
      modulesRoot = _path2.default.join(sourceRoot, 'modules');

  console.log({ env: process.env, directory: directory, projectRoot: projectRoot });

  project.rootModule = getFirstModuleWithComponents(project);

  [projectRoot, sourceRoot, modulesRoot].forEach(createDirectory);

  project.modules.forEach(processModule);

  _lodash2.default.each({
    'app.js': (0, _component.createApp)(project),
    'app.less': 'body { .unmodified-component { text-align: center; } .children { display: flex; justify-content: center; align-items: center; * { flex: 1; } } }\n',
    'index.html': (0, _component.index)(project)
  }, function (content, name) {
    return createFile(_path2.default.join(sourceRoot, name), content);
  });

  return project;

  function getFirstModuleWithComponents(project) {
    // note: these are not necessarily in the order of the source file...
    for (var i = 0; i < project.modules.length; i++) {
      var module = project.modules[i];

      if (module.components && module.components.length > 0) return module.name;
    }
  }

  function processModule(module) {
    var moduleRoot = _path2.default.join(modulesRoot, module.name),
        directivesRoot = _path2.default.join(moduleRoot, 'directives'),
        factoriesRoot = _path2.default.join(moduleRoot, 'factories'),
        filtersRoot = _path2.default.join(moduleRoot, 'filters');

    createDirectory(moduleRoot);

    if (module.routes) {
      module.configs.unshift('routes'); // mutation
      processRoutes(module.routes);
    }

    if (module.components) processComponents(module.components);
    if (module.factories) processFactories(module.factories);
    if (module.filters) processFilters(module.filters);
    if (module.configs) processConfigs(module.configs);

    createModuleIndex(module);

    function processRoutes(routes) {
      createFile(_path2.default.join(moduleRoot, 'routes.js'), (0, _component.createRoutes)(routes));
    }

    function processComponents(components) {
      createDirectory(directivesRoot);

      components.forEach(componentProcessor(directivesRoot));

      function componentProcessor(root) {
        var parent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : { path: './directives' };

        return function (component) {
          component.path = parent.path + '/' + component.name; // mutation
          component.components.forEach(componentProcessor(prepareDirectory(component), component));
        };

        function prepareDirectory(component) {
          var componentRoot = _path2.default.join(root, component.name);

          createDirectory(componentRoot);
          createFiles(componentRoot, component);

          return componentRoot;
        }

        function createFiles(directory, component) {
          var root = _path2.default.join(directory, component.name);

          createFileIfNotExists(_path2.default.join(directory, 'template.html'), (0, _component.template)(component));
          createFileIfNotExists(_path2.default.join(directory, 'style.less'), (0, _component.style)(component));
          createFileIfNotExists(_path2.default.join(directory, 'index.js'), (0, _component.directive)(component));
        }
      }
    }

    function processFactories(factories) {
      createDirectory(factoriesRoot);

      factories.forEach(factoryProcessor(factoriesRoot));

      function factoryProcessor(root) {
        var parent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : { path: './factories' };

        return function (factory) {
          factory.path = parent.path + '/' + factory.name; // mutation
          return factory.factories.map(factoryProcessor(prepareDirectory(factory), factory));
        };

        function prepareDirectory(factory) {
          var factoryRoot = _path2.default.join(root, factory.name);

          createDirectory(factoryRoot);
          createFiles(factoryRoot, factory);

          return factoryRoot;
        }

        function createFiles(directory, f) {
          var root = _path2.default.join(directory, f.name);

          createFileIfNotExists(_path2.default.join(directory, 'index.js'), (0, _component.factory)(f));
        }
      }
    }

    function processFilters(filters) {
      createDirectory(filtersRoot);

      filters.forEach(filterProcessor(filtersRoot));

      function filterProcessor(root) {
        var parent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : { path: './filters' };

        return function (filter) {
          filter.path = parent.path + '/' + filter.name; // mutation
          return filter.filters.map(filterProcessor(prepareDirectory(filter), filter));
        };

        function prepareDirectory(filter) {
          var filterRoot = _path2.default.join(root, filter.name);

          createDirectory(filterRoot);
          createFiles(filterRoot, filter);

          return filterRoot;
        }

        function createFiles(directory, f) {
          var root = _path2.default.join(directory, f.name);

          createFileIfNotExists(_path2.default.join(directory, 'index.js'), (0, _component.filter)(f));
        }
      }
    }

    function processConfigs(configs) {
      configs.forEach(function (config) {
        return createFileIfNotExists(_path2.default.join(moduleRoot, config + '.js'), (0, _component.createConfigs)(config));
      });
    }

    function createModuleIndex(module) {
      createFile(_path2.default.join(moduleRoot, 'index.js'), (0, _component.moduleIndex)(module));
    }
  }
}

function addDependenciesToPackageDotJSON(dependencies) {}

function createDirectory(directory) {
  if (!_fs2.default.existsSync(directory)) {
    console.log('Creating D \'' + directory + '\'');
    _fs2.default.mkdirSync(directory);
  }
}

function createFileIfNotExists(path, content) {
  if (!_fs2.default.existsSync(path)) createFile(path, content);
}

function createFile(path, content) {
  console.log('Creating F \'' + path + '\'');
  _fs2.default.writeFileSync(path, content);
}