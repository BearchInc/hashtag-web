var app = angular.module('Hashtag', [
  'ui.router',

  'Routes',
  'Controllers',
  'Services',
]);


angular.module('Routes', []);

angular.module('Models', []);

angular.module('Services', []);

angular.module('Controllers', ['Models']);

