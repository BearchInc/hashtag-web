angular.module('Controllers')

.controller('LoginCtrl', function ($scope, $state, Auth, Flash) {
  $scope.login = function () {
    Auth.authenticate($scope.user).then(function () {
      if (Auth.authenticated()) {
        $state.transitionTo('posts');
      } else {
        Flash.create('warn', 'Invalid login or password')
      }
    });

    $scope.user = {};
  }
});
