import fs from 'fs';
import path from 'path';

import _ from 'lodash';

const template = component => `<h1 class="unmodified-component">${component.name}</h1>\n`;
const style = component => `${component.name} { }\n`;
const directive = component => `module.exports = () => ({
  restrict: 'E',
  template: require('./template.html'),
  controller: ['$scope', $scope => {

  }]
});`;

const moduleIndex = (function(module) {
  const moduleName = module.name;

  const printComponents = (indent, components) =>

`${(components || [])
      .map(
        ({name, path, components}) =>
            `${indent}.directive('${name}',${Array(Math.max(1, 33 - name.length - indent.length)).join(' ')}require('${path}'))${onNewLineIfExists(printComponents(indent + '  ', components))}`
      ).join('\n')
}`;

  const onNewLineIfExists = value => value ? `\n${value}` : '';

  return ({name, requirements, components, factories, routes}) =>

`require('angular');

${(requirements || []).map(({jsPackageName, moduleName}) => jsPackageName ? `require('${jsPackageName}');`
                                                                          : `import ${moduleName} from '../${moduleName}';`).join('\n')}

export default {
  '${name}': angular.module('${name}', [${(requirements || []).map(({moduleName}) => `'${moduleName}'`).join(', ')}])
${printComponents('    ', components)}
};
`;

})(module);


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

    if (module.components) processComponents(module.components);
    createModuleIndex(module);

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

          createFile(path.join(directory, 'template.html'), template(component));
          createFile(path.join(directory, 'style.less'), style(component));
          createFile(path.join(directory, 'index.js'), directive(component));
        }
      }
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

function createFile(path, content) {
  if (!fs.existsSync(path)) {
    console.log(`Creating F '${path}'`);
    fs.writeFileSync(path, content);
  }
}