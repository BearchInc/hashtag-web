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

app.constant('HOST', HOST);


angular.module('Routes', []);

angular.module('Models', []);

angular.module('Services', []);

angular.module('Controllers', ['Models']).run(function ($rootScope, Account, $http, HOST) {
  $rootScope.currentAccount = Account.current();
});

angular.module('Interceptors', []);
