angular.module('Controllers')

.controller('FeedCtrl', function ($scope, $http, $location, $modal) {
  $scope.getFeed = function (deleted) {
    $scope.posts = [];
    $scope.deleted = deleted;

    $http.get(HOST + '/posts?deleted=' + deleted).success(function(data, status) {
        $scope.posts = data.posts;
    });
  }

  $scope.deletePost = function (p) {
    p.deleted = true, p.deletingPost = true;

    $http.delete(HOST + p.path)
    .success(function(data, status) {
      p.deletingPost = false;
    })
    .error(function () {
      p.deleted = false, p.deletingPost = false;
    });
  };

  $scope.restorePost = function (p) {
    p.restoringPost = true; p.deleted = false;

    $http.post(HOST + p.path)
    .success(function(data, status) {
      p.restoringPost = false;
    })
    .error(function () {
      p.deleted = true; p.restoringPost = false;
    });
  };

  $scope.openModal = function (p) {
    var modalInstance = $modal.open({
      animation: true,
      templateUrl: 'blockAuthor.html',
      controller: 'ModalCtrl',
      size: ''
    });

    modalInstance.result.then(function (block) {
      block.post_id = p.id;

      $http.post(HOST + p.block_author_path, block)
      .success(function(data, status) {
      })
      .error(function () {
      });
    }, function () {
    });
  };

  $scope.getFeed(false);
}).controller('ModalCtrl', function($scope, $modalInstance) {
  $scope.ok = function (block) {
    $modalInstance.close(block);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
});
