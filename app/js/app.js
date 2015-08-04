var app = angular.module('Hashtag', [
  'angular-ladda',
  'angular-sortable-view',
  'flash',
  'infinite-scroll',
  'ngAnimate',
  'ui.bootstrap',
  'ui.router',
  'yaru22.angular-timeago',

  'Routes',
  'Controllers',
  'Services',
  'Interceptors'
]);

app.constant('HOST', HOST);


angular.module('Routes', []);

angular.module('Models', []);

angular.module('Services', []);

angular.module('Controllers', ['Models']).run(function ($rootScope, Account) {
  $rootScope.currentAccount = Account.current();
});

angular.module('Interceptors', []);
