angular.module('Controllers')

.controller('PostsIndex', function ($scope, $http, $modal, $sce, $location, Post, Flash) {
  $scope.allPosts = function () {
    $scope.posts = [];
    $scope.deletedActive = false;

    Post.all().success(handlePosts);
  };

  $scope.deletedPosts = function () {
    $scope.posts = [];
    $scope.deletedActive = true;

    Post.deleted()
        .success(function(data, status) {
          data.posts = data.posts.map(function (p) {
            p.deleted = true;
            return p;
          });
          handlePosts(data)
        })
  };

  $scope.allPosts();


  $scope.getTagFeed = function (tag) {
    $scope.posts = [];

    $http.get(HOST + '/feeds/' + tag).success(handlePosts);
  };

  function handlePosts (data) {
    var posts = data.posts;
    var tagregex = /#([a-zA-Z0-9_-]+)($|[ !.?,;:])/g;

    posts.forEach(function(p, index, posts) {
      posts[index].description = $sce.trustAsHtml(p.description.replace(tagregex, function(match, tag) {
        return '<a href="/#/posts?tag=' + tag + '">' + match + '</a>';
      }));
    });

    $scope.posts = posts;
  }

  function loadFeed() {
    var params = $location.search();
    if (params.tag) {
      $scope.getTagFeed(params.tag);
    } else {
      $scope.allPosts();
    }
  }

  $scope.$on('$locationChangeStart', loadFeed);

  loadFeed();




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
        Flash.create('success', 'Author successfully blocked');
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
