angular.module('Controllers')

.controller('PostsIndex', function ($scope, $http, $modal, $sce, $location, Channel, Account, Post, Flash) {
  $scope.allPosts = function () {
    $scope.deletedActive = false;
    $scope.showTabs = true;

    Post.all().success(processData);
    $scope.pauseScroll = false;
  };

  $scope.deletedPosts = function () {
    $scope.deletedActive = true;
    $scope.showTabs = true;

    Post.deleted()
      .success(function(data, status) {
        data.posts = data.posts.map(function (p) {
          p.deleted = true;
          return p;
        });
        processData(data)
      })
  };

  $scope.getTagPosts = function (tag) {
    $scope.showTabs = false;
    $http.get(HOST + '/feeds/' + tag).success(processData);
  };

  function processData (data) {
    var posts = data.posts;
    handlePosts(posts);
    $scope.posts = posts;

    $scope.cursor = data.page_cursor;
  }

  function handlePosts (posts) {
    var tagregex = /#([a-zA-Z0-9_-]+)($|[ !.?,;:])/g;

    posts.forEach(function(p, index, posts) {
      posts[index].description = $sce.trustAsHtml(p.description.replace(tagregex, function(match, tag) {
        return '<a href="/#/posts?tag=' + tag + '">' + match + '</a>';
      }));
    });
  }

  function loadFeed() {
    var params = $location.search();
    if (params.tag) {
      $scope.getTagPosts(params.tag);
    } else {
      $scope.allPosts();
    }
  }

  $scope.$on('$locationChangeStart', loadFeed);


  $scope.posts = [];
  $scope.cursor = "";
  $scope.pauseScroll = true;
  loadFeed();

  if(Account.current().isAdmin()) {
    var handler = {
      onopen: function() {
        console.log("SOCKET OPENED");
        $http.get(HOST+"/som");
      },
      onmessage: function(message) {
        console.log("MESSAGE RECEIVED");
        console.log(message);
      },
      onerror: function(error) {
        console.log("SOCKET ERROR:");
        console.log(error);
      },
      onclose: function() {
        console.log("SOCKET CLOSED");
      }
    };
    var socket = Channel.createSocket(handler);
    setTimeout(function() {
      socket.close();
    }, 10000);
  }

  $scope.loadMorePosts = function () {
    Post.loadMore($scope.cursor).success(function(data) {
      var more = data.posts;
      $scope.cursor = data.page_cursor;

      if (more.length === 0) {
        $scope.pauseScroll = true;
        return
      }
      handlePosts(more);
      $scope.posts.push.apply($scope.posts, more);
    });
  };

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
