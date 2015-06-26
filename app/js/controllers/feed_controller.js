angular.module('Controllers')

.controller('FeedCtrl', function ($scope, $http, $location, $modal, $sce) {
  $scope.getFeed = function (deleted) {
    $scope.posts = [];
    $scope.deleted = deleted;
    $scope.showTabs = true;
    $scope.showRestore = true;

    $http.get(HOST + '/posts?deleted=' + deleted).success(handlePosts);
  }
  
  $scope.getTagFeed = function (tag) {
    $scope.posts = [];
    $scope.showTabs = false;
    $scope.showRestore = false;

    $http.get(HOST + '/feeds/' + tag).success(handlePosts);
  }

  function handlePosts (data, status) {
    var posts = data.posts;
    var tagregex = /#([a-zA-Z0-9_-]+)($|[ !.?,;:])/g;
    posts.forEach(function(p, index, posts) {
      posts[index].description = $sce.trustAsHtml(p.description.replace(tagregex, function(match, tag) {
        return '<a href="/#/feed?tag=' + tag + '">' + match + '</a>';
      }));
    });
    $scope.posts = posts;
  }

  $scope.deletePost = function (p) {
    p.deleted = true, p.deletingPost = true;

    $http.delete(HOST + p.path)
    .success(function(data, status) {
      p.deletingPost = false;
      
      var i, index;
      for (i = 0; i < $scope.posts.length; i++) {
        if ($scope.posts[i].path === p.path) {
          index = i;
        }
      }

      $scope.posts.splice(index, 1);
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

  function loadFeed() {
    var params = $location.search();
    if (params.tag) {
      $scope.getTagFeed(params.tag);
    } else {
      $scope.getFeed(false);
    }
  }

  $scope.$on('$locationChangeStart', loadFeed);

  loadFeed();

})
.controller('ModalCtrl', function($scope, $modalInstance) {
  $scope.ok = function (block) {
    $modalInstance.close(block);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
});
