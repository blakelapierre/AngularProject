import fs from 'fs';
import path from 'path';

import _ from 'lodash';

import {createRoutes, createConfigs, createApp, directive, factory, filter, index, moduleIndex, style, template} from './component';

export default function toAngularProject(project, directory = project.name) {
  const projectRoot = `${process.env.project_root || directory}`,
        sourceRoot = path.join(projectRoot, 'src'),
        modulesRoot = path.join(sourceRoot, 'modules');

  console.log({env: process.env, directory, projectRoot});

  project.rootModule = getFirstModuleWithComponents(project);

  [projectRoot, sourceRoot, modulesRoot].forEach(createDirectory);

  project.modules.forEach(processModule);

  _.each({
    'app.js': createApp(project),
    'app.less': `body { .unmodified-component { text-align: center; } .children { display: flex; justify-content: center; align-items: center; * { flex: 1; } } }\n`,
    'index.html': index(project)
  }, (content, name) => createFile(path.join(sourceRoot, name), content));

  return project;

  function getFirstModuleWithComponents(project) {
    // note: these are not necessarily in the order of the source file...
    for (let i = 0; i < project.modules.length; i++) {
      const module = project.modules[i];

      if (module.components && module.components.length > 0) return module.name;
    }
  }

  function processModule(module) {
    const moduleRoot = path.join(modulesRoot, module.name),
          directivesRoot = path.join(moduleRoot, 'directives'),
          factoriesRoot = path.join(moduleRoot, 'factories'),
          filtersRoot = path.join(moduleRoot, 'filters');

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
          return factory.factories.map(factoryProcessor(prepareDirectory(factory), factory));
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

    function processFilters(filters) {
      createDirectory(filtersRoot);

      filters.forEach(filterProcessor(filtersRoot));

      function filterProcessor(root, parent = {path: `./filters`}) {
        return filter => {
          filter.path = `${parent.path}/${filter.name}`; // mutation
          return filter.filters.map(filterProcessor(prepareDirectory(filter), filter));
        };

        function prepareDirectory(filter) {
          const filterRoot = path.join(root, filter.name);

          createDirectory(filterRoot);
          createFiles(filterRoot, filter);

          return filterRoot;
        }

        function createFiles(directory, f) {
          const root = path.join(directory, f.name);

          createFileIfNotExists(path.join(directory, 'index.js'), filter(f));
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

function addDependenciesToPackageDotJSON(dependencies) {

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