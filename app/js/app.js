var app = angular.module('Hashtag', [
  'ui.router',
  'angular-ladda',
  'ui.bootstrap',
  'ngAnimate',
  'flash',
  'infinite-scroll',

  'Routes',
  'Controllers',
  'Services',
  'Interceptors',
]);

app.constant('HOST', 'http://localhost:8080');


angular.module('Routes', []);

angular.module('Models', []);

angular.module('Services', []);

angular.module('Controllers', ['Models']);

angular.module('Interceptors', []);
