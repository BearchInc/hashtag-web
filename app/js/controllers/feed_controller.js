angular.module('Controllers')

    .controller('FeedCtrl', function ($scope, $http, Post) {
      $http.post(HOST + '/login', {id: 'hashtag-web'}).success(function(data, status) {
        $http.defaults.headers.common.Authorization = 'Basic ' + btoa(data.account.auth_token);

        $http.get(HOST + '/posts').success(function(data, status) {
            $scope.posts = data.posts;
        });
      });

      $scope.deletePost = function (p) {
        p.deleted = true, p.waiting = true;

        $http.patch(HOST + p.delete_path)
        .success(function(data, status) {
          p.waiting = false;
        })
        .error(function () {
          p.deleted = false, p.waiting = false;
        });
      };

      $scope.restorePost = function (p) {
        p.waiting = true;
        p.deleted = false;

        $http.delete(HOST + p.delete_path)
        .success(function(data, status) {
          p.waiting = false;
        })
        .error(function () {
          p.deleted = true;
          p.waiting = false;
        });
      };
    });

