import fs from 'fs';
import path from 'path';

import _ from 'lodash';

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

        element.components.forEach(processComponent(directivesRoot));
      }
      else if (element.routes) {

      }
      else if (element.factories) {

      }

      function processComponent(root) {
        return component => {
          const componentRoot = path.join(root, component.name);

          createDirectory(componentRoot);

          component.components.forEach(processComponent(componentRoot));
        };
      }
    }
  }
}

function createDirectory(path) {
  if (!fs.existsSync(path)) {
    console.log(`Creating '${path}'`);
    fs.mkdirSync(path);
  }
}