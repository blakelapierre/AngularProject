import fs from 'fs';
import path from 'path';

import _ from 'lodash';

import {createRoutes, createConfigs, createApp, directive, factory, index, moduleIndex, style, template} from './component';

export function toAngularProject(project) {
  const projectRoot = `${process.env.project_root || '.'}/${project.name}`,
        sourceRoot = path.join(projectRoot, 'src'),
        modulesRoot = path.join(sourceRoot, 'modules');

  project.rootModule = getFirstModuleWithComponents(project);

  createDirectory(projectRoot);
  createDirectory(sourceRoot);
  createDirectory(modulesRoot);

  project.modules.forEach(processModule);

  createFile(path.join(sourceRoot, 'app.js'), createApp(project));
  createFile(path.join(sourceRoot, 'app.less'), `body { }\n`);
  createFile(path.join(sourceRoot, 'index.html'), index(project));

  function getFirstModuleWithComponents(project) {
    for (let i = 0; i < project.modules.length; i++) {
      const module = project.modules[i];

      if (module.components && module.components.length > 0) return module.name;
    }
  }

  function processModule(module) {
    const moduleRoot = path.join(modulesRoot, module.name),
          directivesRoot = path.join(moduleRoot, 'directives'),
          factoriesRoot = path.join(moduleRoot, 'factories');

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
      createFile(path.join(moduleRoot, 'routes.js'), createRoutes(routes));
    }

    function processComponents(components) {
      createDirectory(directivesRoot);

      components.forEach(componentProcessor(directivesRoot));

      function componentProcessor(root, parent = {path: `./directives`}) {
        return component => {
          component.path = `${parent.path}/${component.name}`; // mutation
          component.components.forEach(componentProcessor(prepareDirectory(component), component));
        };

        function prepareDirectory(component) {
          const componentRoot = path.join(root, component.name);

          createDirectory(componentRoot);
          createFiles(componentRoot, component);

          return componentRoot;
        }

        function createFiles(directory, component) {
          const root = path.join(directory, component.name);

          createFileIfNotExists(path.join(directory, 'template.html'), template(component));
          createFileIfNotExists(path.join(directory, 'style.less'), style(component));
          createFileIfNotExists(path.join(directory, 'index.js'), directive(component));
        }
      }
    }

    function processFactories(factories) {
      createDirectory(factoriesRoot);

      factories.forEach(factoryProcessor(factoriesRoot));

      function factoryProcessor(root, parent = {path: `./factories`}) {
        return factory => {
          factory.path = `${parent.path}/${factory.name}`; // mutation
          factory.factories.forEach(factoryProcessor(prepareDirectory(factory), factory));
        };

        function prepareDirectory(factory) {
          const factoryRoot = path.join(root, factory.name);

          createDirectory(factoryRoot);
          createFiles(factoryRoot, factory);

          return factoryRoot;
        }

        function createFiles(directory, f) {
          const root = path.join(directory, f.name);

          createFileIfNotExists(path.join(directory, 'index.js'), factory(f));
        }
      }
    }

    function processConfigs(configs) {
      configs.forEach(config => createFileIfNotExists(path.join(moduleRoot, `${config}.js`), createConfigs(config)));
    }

    function createModuleIndex(module) {
      createFile(path.join(moduleRoot, 'index.js'), moduleIndex(module));
    }
  }
}

function createDirectory(directory) {
  if (!fs.existsSync(directory)) {
    console.log(`Creating D '${directory}'`);
    fs.mkdirSync(directory);
  }
}

function createFileIfNotExists(path, content) {
  if (!fs.existsSync(path)) createFile(path, content);
}

function createFile(path, content) {
  console.log(`Creating F '${path}'`);
  fs.writeFileSync(path, content);
}