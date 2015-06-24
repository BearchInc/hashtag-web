angular.module('Controllers')

.controller('UserCtrl', function ($scope, $http, $state, Auth) {

  $scope.roles = [
  {
    name: 'User', 
    value: 0
  },
  {
    name: 'Moderator',
    value: 1
  },
  {
    name: 'Administator',
    value: 2
  }];

  $scope.user = {};
  $scope.createUser = function() {
    $scope.user.role = typeof $scope.user.role === 'undefined' ? 0 : parseInt($scope.user.role);
    $http.post(HOST + '/accounts', $scope.user)
    .success(function(data, status, headers, config) {
      Auth.setAuthToken(data.account.auth_token);
      $state.transitionTo('feed');
    })
    .error(function(data, status, headers, config) {
      alert('Error: status=' + status + ', data=' + data);
    });
  };
  
  $http.post(HOST + '/login', {id: 'hashtag-web'}).success(function(data, status) {
    $http.defaults.headers.common.Authorization = 'Basic ' + btoa(data.account.auth_token);
    $scope.getFeed($location.search().deleted);
  });
});


