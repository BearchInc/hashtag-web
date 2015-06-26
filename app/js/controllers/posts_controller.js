angular.module('Controllers')

.controller('PostsIndex', function ($scope, $http, $modal, Post, Flash) {
  $scope.allPosts = function () {
    $scope.posts = [];
    $scope.deletedActive = false;

    Post.all()
      .success(function(data, status) {
        $scope.posts = data.posts;
      });
  };

  $scope.deletedPosts = function () {
    $scope.posts = [];
    $scope.deletedActive = true;

    Post.deleted()
      .success(function(data, status) {
        $scope.posts = data.posts.map(function (p) {
          p.deleted = true;
          return p;
        });
      })
  };

  $scope.allPosts();


  $scope.deletePost = function (p) {
    p.deletingPost = true;

    Post.delete(p)
      .success(function(data, status) {
        p.deleted = true;
        p.deletingPost = false;
      })
      .error(function (data) {
        p.deletingPost = false;
        Flash.create('danger', 'Err: ' + data);
      });
  };

  $scope.restorePost = function (p) {
    p.restoringPost = true;

    Post.restore(p)
      .success(function(data, status) {
        p.restoringPost = false;
        p.deleted = false;
      })
      .error(function (data) {
        p.deleted = true;
        p.restoringPost = false;
        Flash.create('danger', 'Err: ' + data);
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
        if (status !== 200) {
          Flash.create('danger', 'Err: ' + data);
          return;
        }
        Flash.create('success', 'Account successfully blocked');
      })
      .error(function () {
        Flash.create('danger', 'Err: ' + data);
      });
    }, function () {
    });
  };
})

.controller('ModalCtrl', function($scope, $modalInstance) {
  $scope.ok = function (block) {
    $modalInstance.close(block);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
});
