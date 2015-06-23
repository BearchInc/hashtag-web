angular.module('Controllers')

  .controller('FeedDeletedCtrl', function ($scope, $http) {
    $http.post(HOST + '/login', {id: 'hashtag-web'}).success(function(data, status) {
      $http.defaults.headers.common.Authorization = 'Basic ' + btoa(data.account.auth_token);

      $http.get(HOST + '/posts?deleted=true').success(function(data, status) {
        $scope.posts = data.posts;
      });
    });
  });
