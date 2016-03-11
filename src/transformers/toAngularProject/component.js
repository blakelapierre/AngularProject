export function template(component) {
  return `<h1 class="unmodified-component">${component.name}</h1>\n`;
}

export function style(component) {
  return `${component.name} { }\n`;
}

export function directive(component) {
  return `module.exports = () => ({
  restrict: 'E',
  template: require('./template.html'),
  controller: ['$scope', $scope => {

  }]
});`;
}

export const moduleIndex = (function() {
  const onNewLineIfExists = value => value ? `\n${value}` : '';
  const printComponents = (indent, components) =>

`${(components || [])
      .map(
        ({name, path, components}) =>
            `${indent}.directive('${name}',${Array(Math.max(1, 33 - name.length - indent.length)).join(' ')}require('${path}'))${onNewLineIfExists(printComponents(indent + '  ', components))}`
      ).join('\n')
}`;

  const printFactories = (indent, factories) =>

`${(factories || [])
      .map(
        ({name, path, factories}) =>
            `${indent}.factory('${name}',${Array(Math.max(1, 33 - name.length - indent.length)).join(' ')}require('${path}'))${onNewLineIfExists(printFactories(indent + '  ', factories))}`
      ).join('\n')
}`;

  const printConfigs = (indent, configs) =>
`${
  (configs || []).map(config => `${indent}.config(require('./${config}'))`).join('\n')
}`;

  return ({name, requirements, components, factories, routes, configs}) => autoGenerateWarning(
`require('angular');

${(requirements || []).map(({jsPackageName, moduleName}) => `require('${jsPackageName || moduleName}');`).join('\n')}

export default {
  '${name}': angular.module('${name}', [${(requirements || []).map(({moduleName}) => `'${moduleName}'`).join(', ')}])
${printComponents('    ', components)}
${printFactories('    ', factories)}
${printConfigs('    ', configs)}
};`);

})();

export const createRoutes = routes => autoGenerateWarning(
// autogenerateWarning`
// export default ...
// `
`export default ['$routeProvider', $routeProvider => {
  const routerController = [
    '$scope', '$routeParams',
    ($scope, $routeParams) => Object.assign($scope, $routeParams)
  ];

  // Allows you to wire a route to a specific item in a database.
  // Currently, this is equivalent to grabbing a value from a
  // key-value store based on a user provided parameter in the URL
  const dataController = [
    '$scope', '$routeParams', 'dataStore',
    ($scope, $routeParams, dataStore) => {
      const something = reduce($routeParams, (params, value, name) => {
        const [store, index] = name.match(/(\\b|[A-Z]+)[a-z]*/g);

        console.log({name, value, store, index});

        params[store] = dataStore[${'`get${capitalize(store)}By${index}`'}](value);

        return params;
      });

      console.log({$scope, dataStore, something});

      Object.assign($scope, something);

      function capitalize(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
      }
    }
  ];

  $routeProvider
${routes.map(route =>
`      .when('${route.path}', {
      template: '<${route.name}></${route.name}>'
    })`).join('\n')}
    .otherwise({
      template: 'Where\\'d you come from?'
    });

  function reduce(list, fn, initial = {}) {
    let state = initial;
    for (let key in list) state = fn(state, list[key], key);
    return state;
  }
}];`);

export const createConfigs = config =>
`export default [() => {

}];`;

export const createApp = project => autoGenerateWarning(`
import ${project.rootModule} from './modules/${project.rootModule}';

export default {
  '${project.rootModule}': ${project.rootModule}['${project.rootModule}']
};
`);

function autoGenerateWarning(string) {
  return `/* !!!!!!! This file is autogenerated. DO NOT MODIFY !!!!!!! */
${string}
/* !!!!!!! This file is autogenerated. DO NOT MODIFY !!!!!!! */`;
}
