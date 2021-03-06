export function template(component) {
  return `<h1 class="unmodified-component">${component.name}</h1><div class="children">${component.components.map(({name}) => `<${name}></${name}>`).join('')}</div>`;
}

export function style(component) {
  return `${component.name} { flex: 1; }\n`;
}

export function directive(component) {
  return `module.exports = () => ({
  restrict: 'E',
  template: require('./template.html'),
  controller: ['$scope', $scope => {

  }]
});`;
}

export function factory(project) {
  return `module.exports = () => ({

});`;
}

export function filter(project) {
  return `module.exports = () => input => 'New Filter!' + input;`;
}

export const index =
  component =>
`<!DOCTYPE html>
<html ng-app="${component.rootModule}">
  <head>
    <meta charset="utf-8">

    <title>${component.name}</title>

    <!-- Do we want this? -->
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <!-- Place favicon.ico and apple-touch-icon.png in the root directory -->

    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.4.0/css/font-awesome.min.css">

    <link rel="stylesheet" href="app.css">
  </head>
  <body>
    <ng-view></ng-view>
    <script src="vendor.js"></script>
    <script src="app.js"></script>
  </body>
</html>
`;

export const moduleIndex = (function() {
  const onNewLineIfExists = value => value ? `\n${value}` : '';
  const printComponents = (indent, components) =>

`${(components || [])
      .map(
        ({name, path, components}) =>
            `${indent}.directive('${camelCase(name)}',${Array(Math.max(1, 33 - name.length - indent.length)).join(' ')}require('${path}'))${onNewLineIfExists(printComponents(indent + '  ', components))}`
      ).join('\n')
}`;

  const printFactories = (indent, factories) =>

`${(factories || [])
      .map(
        ({name, path, factories}) =>
            `${indent}.factory('${camelCase(name)}',${Array(Math.max(1, 33 - name.length - indent.length)).join(' ')}require('${path}'))${onNewLineIfExists(printFactories(indent + '  ', factories))}`
      ).join('\n')
}`;

  const printFilters = (indent, filters) =>

`${(filters || [])
      .map(
        ({name, path, filters}) =>
            `${indent}.filter('${camelCase(name)}',${Array(Math.max(1, 33 - name.length - indent.length)).join(' ')}require('${path}'))${onNewLineIfExists(printFilters(indent + '  ', filters))}`
      ).join('\n')
}`;

  const printConfigs = (indent, configs) =>
`${
  (configs || []).map(config => `${indent}.config(require('./${config}').default)`).join('\n')
}`;

  return ({name, requirements, components, factories, filters, routes, configs}) => autoGenerateWarning(
`require('angular');

${(requirements || []).map(({jsPackageName, moduleName}) => `require('${jsPackageName || ('../' + moduleName)}');`).join('\n')}

export default {
  '${name}': angular.module('${name}', [${(requirements || []).map(({moduleName}) => `'${moduleName}'`).join(', ')}])
${printComponents('    ', components)}
${printFactories('    ', factories)}
${printFilters('    ', filters)}
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
      template: '<${route.name}></${route.name}>'${route.path.indexOf(':') >= 0 ? ',\n      controller: dataController' : ''}
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

export const createApp = ({rootModule}) => autoGenerateWarning(`
import ${rootModule} from './modules/${rootModule}';

export default {
  '${rootModule}': ${rootModule}['${rootModule}']
};
`);

function autoGenerateWarning(string) {
  return `/* !!!!!!! WARNING! This file is autogenerated. DO NOT MODIFY !!!!!!! */
${string}
/* !!!!!!! WARNING! This file is autogenerated. DO NOT MODIFY !!!!!!! */`;
}

const SPECIAL_CHARS_REGEXP = /([\:\-\_]+(.))/g;
const MOZ_HACK_REGEXP = /^moz([A-Z])/;

function camelCase(name) {
  return name.
    replace(SPECIAL_CHARS_REGEXP, function(_, separator, letter, offset) {
      return offset ? letter.toUpperCase() : letter;
    }).
    replace(MOZ_HACK_REGEXP, 'Moz$1');
}