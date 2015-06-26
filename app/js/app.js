var app = angular.module('Hashtag', [
  'ui.router',
  'angular-ladda',
  'ui.bootstrap',
  'ngAnimate',
  'flash',

  'Routes',
  'Controllers',
  'Services',
  'Interceptors',
]);

app.constant('HOST', 'http://localhost:8080');


angular.module('Routes', []);

angular.module('Models', []);

angular.module('Services', []);

angular.module('Controllers', ['Models']).run(function ($rootScope, Account) {
  $rootScope.currentAccount = Account.current();
});

angular.module('Interceptors', []);
