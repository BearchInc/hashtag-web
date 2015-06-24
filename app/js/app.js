var app = angular.module('Hashtag', [
  'ui.router',

  'Routes',
  'Controllers',
  'Services',
]);

app.constant('HOST', 'http://localhost:8080');


angular.module('Routes', []);

angular.module('Models', []);

angular.module('Services', []);

angular.module('Controllers', ['Models']);

