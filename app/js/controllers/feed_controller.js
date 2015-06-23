angular.module('Controllers')

.controller('FeedCtrl', function ($scope, $http, $location) {

  $scope.getFeed = function (deleted) {
    $scope.deleted = deleted;

    $http.get(HOST + '/posts?deleted=' + deleted).success(function(data, status) {
        $scope.posts = data.posts;
    });
  }

  $scope.deletePost = function (p) {
    p.deleted = true, p.waiting = true;

    $http.patch(HOST + p.path, {deleted: true})
    .success(function(data, status) {
      p.waiting = false;
    })
    .error(function () {
      p.deleted = false, p.waiting = false;
    });
  };

  $scope.restorePost = function (p) {
    p.waiting = true; p.deleted = false;

    $http.patch(HOST + p.path, {deleted: false})
    .success(function(data, status) {
      p.waiting = false;
    })
    .error(function () {
      p.deleted = true; p.waiting = false;
    });
  };


  $http.post(HOST + '/login', {id: 'hashtag-web'}).success(function(data, status) {
    $http.defaults.headers.common.Authorization = 'Basic ' + btoa(data.account.auth_token);
    $scope.getFeed($location.search().deleted);
  });

});

