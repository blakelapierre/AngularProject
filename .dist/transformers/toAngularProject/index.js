'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.toAngularProject = toAngularProject;

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _component = require('./component');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function toAngularProject(project, directory = '.') {
  const projectRoot = `${ process.env.project_root || directory }/${ project.name }`,
        sourceRoot = _path2.default.join(projectRoot, 'src'),
        modulesRoot = _path2.default.join(sourceRoot, 'modules');

  project.rootModule = getFirstModuleWithComponents(project);

  [projectRoot, sourceRoot, modulesRoot].forEach(createDirectory);

  project.modules.forEach(processModule);

  _lodash2.default.each({
    'app.js': (0, _component.createApp)(project),
    'app.less': `body { .unmodified-component { text-align: center; } .children { display: flex; justify-content: center; align-items: center; * { flex: 1; } } }\n`,
    'index.html': (0, _component.index)(project)
  }, (content, name) => createFile(_path2.default.join(sourceRoot, name), content));

  return project;

  function getFirstModuleWithComponents(project) {
    // note: these are not necessarily in the order of the source file...
    for (let i = 0; i < project.modules.length; i++) {
      const module = project.modules[i];

      if (module.components && module.components.length > 0) return module.name;
    }
  }

  function processModule(module) {
    const moduleRoot = _path2.default.join(modulesRoot, module.name),
          directivesRoot = _path2.default.join(moduleRoot, 'directives'),
          factoriesRoot = _path2.default.join(moduleRoot, 'factories');

    createDirectory(moduleRoot);

    if (module.routes) {
      module.configs.unshift('routes'); // mutation
      processRoutes(module.routes);
    }

    if (module.components) processComponents(module.components);
    if (module.factories) processFactories(module.factories);
    if (module.configs) processConfigs(module.configs);

    createModuleIndex(module);

    function processRoutes(routes) {
      createFile(_path2.default.join(moduleRoot, 'routes.js'), (0, _component.createRoutes)(routes));
    }

    function processComponents(components) {
      createDirectory(directivesRoot);

      components.forEach(componentProcessor(directivesRoot));

      function componentProcessor(root, parent = { path: `./directives` }) {
        return component => {
          component.path = `${ parent.path }/${ component.name }`; // mutation
          component.components.forEach(componentProcessor(prepareDirectory(component), component));
        };

        function prepareDirectory(component) {
          const componentRoot = _path2.default.join(root, component.name);

          createDirectory(componentRoot);
          createFiles(componentRoot, component);

          return componentRoot;
        }

        function createFiles(directory, component) {
          const root = _path2.default.join(directory, component.name);

          createFileIfNotExists(_path2.default.join(directory, 'template.html'), (0, _component.template)(component));
          createFileIfNotExists(_path2.default.join(directory, 'style.less'), (0, _component.style)(component));
          createFileIfNotExists(_path2.default.join(directory, 'index.js'), (0, _component.directive)(component));
        }
      }
    }

    function processFactories(factories) {
      createDirectory(factoriesRoot);

      factories.forEach(factoryProcessor(factoriesRoot));

      function factoryProcessor(root, parent = { path: `./factories` }) {
        return factory => {
          factory.path = `${ parent.path }/${ factory.name }`; // mutation
          return factory.factories.map(factoryProcessor(prepareDirectory(factory), factory));
        };

        function prepareDirectory(factory) {
          const factoryRoot = _path2.default.join(root, factory.name);

          createDirectory(factoryRoot);
          createFiles(factoryRoot, factory);

          return factoryRoot;
        }

        function createFiles(directory, f) {
          const root = _path2.default.join(directory, f.name);

          createFileIfNotExists(_path2.default.join(directory, 'index.js'), (0, _component.factory)(f));
        }
      }
    }

    function processConfigs(configs) {
      configs.forEach(config => createFileIfNotExists(_path2.default.join(moduleRoot, `${ config }.js`), (0, _component.createConfigs)(config)));
    }

    function createModuleIndex(module) {
      createFile(_path2.default.join(moduleRoot, 'index.js'), (0, _component.moduleIndex)(module));
    }
  }
}

function addDependenciesToPackageDotJSON(dependencies) {}

function createDirectory(directory) {
  if (!_fs2.default.existsSync(directory)) {
    console.log(`Creating D '${ directory }'`);
    _fs2.default.mkdirSync(directory);
  }
}

function createFileIfNotExists(path, content) {
  if (!_fs2.default.existsSync(path)) createFile(path, content);
}

function createFile(path, content) {
  console.log(`Creating F '${ path }'`);
  _fs2.default.writeFileSync(path, content);
}
//# sourceMappingURL=index.js.map
