import fs from 'fs';
import path from 'path';

import _ from 'lodash';

const template = component => `${component.name}\n`;
const style = component => `${component.name} { }\n`;
const directive = component => `module.exports = () => ({
  restrict: 'E',
  template: require('./template.html'),
  controller: ['$scope', $scope => {

  }]
});`;


export function toAngularProject(project) {
  const projectRoot = `${project.name}`,
        modulesRoot = path.join(projectRoot, 'modules');

  createDirectory(projectRoot);
  createDirectory(modulesRoot);

  project.modules.forEach(processModule);

  function processModule(module) {
    const moduleRoot = path.join(modulesRoot, module.name),
          directivesRoot = path.join(moduleRoot, 'directives'),
          factoriesRoot = path.join(moduleRoot, 'factories');

    createDirectory(moduleRoot);

    module.elements.forEach(processElement);

    function processElement(element) {
      if (element.requirements) {

      }
      else if (element.components) {
        createDirectory(directivesRoot);

        element.components.forEach(componentProcessor(directivesRoot));
      }
      else if (element.routes) {

      }
      else if (element.factories) {

      }

      function componentProcessor(root) {
        return component => {
          component.components.forEach(componentProcessor(prepareDirectory(component)));
        };

        function prepareDirectory(component) {
          const componentRoot = path.join(root, component.name);

          createDirectory(componentRoot);
          createFiles(componentRoot, component);

          return componentRoot;
        }

        function createFiles(directory, component) {
          const root = path.join(directory, component.name);

          createFile(path.join(directory, 'template.html'), template(component));
          createFile(path.join(directory, 'style.less'), style(component));
          createFile(path.join(directory, 'index.js'), directive(component));
        }
      }
    }
  }
}

function createDirectory(directory) {
  if (!fs.existsSync(directory)) {
    console.log(`Creating D '${directory}'`);
    fs.mkdirSync(directory);
  }
}

function createFile(path, content) {
  if (!fs.existsSync(path)) {
    console.log(`Creating F '${path}'`);
    fs.writeFileSync(path, content);
  }
}