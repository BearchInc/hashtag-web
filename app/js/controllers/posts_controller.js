angular.module('Controllers')

.controller('PostsIndex', function ($rootScope, $scope, $http, $modal, $sce, $location, Post, Flash) {
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

    posts.forEach(function(p) {
      p.description = $sce.trustAsHtml(p.description.replace(tagregex, function(match, tag) {
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

  $scope.posts = [];
  $scope.cursor = "";
  $scope.pauseScroll = true;
  loadFeed();

  $scope.$on('$locationChangeStart', loadFeed);

  $rootScope.$on('newPost',
    function(event, args) {
      var post = args.new_post;

      var description = post.description;

      handlePosts([post]);
      $scope.posts.unshift(post);

      if (post.image) {
        var imgsrc = post.image;
        var URL = post.image;
        var imgHTML = '<img src="{2}" width="200">';
      } else {
        var imgsrc = "No image";
        var URL = '/posts';
        var imgHTML = '<span data-notify="message">{2}</span>';
      }
      var body = $sce.trustAsHtml('<b>' + description + '</b>')

      $.notify({
        title: body,
        message: imgsrc,
        url: URL,
      }, {
        placement: {
          from: 'top',
          align: 'left'
        },
        delay: 5000,
        template:
        '<div data-notify="container" class="col-xs-11 col-sm-3 alert alert-{0}" role="alert">' +
          '<button type="button" aria-hidden="true" class="close" data-notify="dismiss">×</button>' +
          '<span data-notify="icon"></span> ' +
          '<span data-notify="title">{1}</span><br> ' +
          imgHTML +
          '<a href="{3}" target="{4}" data-notify="url"></a>' +
        '</div>'
      });

    }
  );


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
