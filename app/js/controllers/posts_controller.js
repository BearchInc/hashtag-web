angular.module('Controllers')

  .controller('PostsIndex', function ($rootScope, $scope, $http, $window, $compile, $modal, $sce, $location, Post, Flash) {
    $scope.allPosts = function () {
      $scope.deletedActive = false;

      Post.all().success(processData);
    };

    $scope.deletedPosts = function () {
      $scope.deletedActive = true;

      Post.deleted()
        .success(function (data, status) {
          data.posts = data.posts.map(function (p) {
            p.deleted = true;
            return p;
          });
          processData(data)
        });
    };

    $scope.getTagPosts = function (tag) {
      $http.get(HOST + '/feeds/' + tag).success(processData);
    };

    function processData(data) {
      var posts = data.posts;
      handlePosts(posts);
      $scope.posts = posts;

      $scope.cursor = $scope.tag ? data.next_page_cursor : data.page_cursor;
    }

    function handlePosts(posts) {
      var tagregex = /#([a-zA-Z0-9_-]+)($|[ !.?,;:])/g;

      posts.forEach(function (p) {
        p.description = $sce.trustAsHtml(p.description.replace(tagregex, function (match, tag) {
          return '<a href="/#/posts?tag=' + tag + '">' + match + '</a>';
        }));
      });
    }

    function loadFeed() {
      $scope.cursor = "";
      $window.scrollTo(0, 0);
      var params = $location.search();
      if (params.tag) {
        $scope.showTabs = false;
        $scope.tag = params.tag;
        $scope.getTagPosts(params.tag);
      } else {
        $scope.showTabs = true;
        $scope.tag = "";
        $scope.allPosts();
      }
      $scope.pauseScroll = false;
    }

    $scope.posts = [];
    $scope.pauseScroll = true;
    loadFeed();

    $scope.$on('$locationChangeStart', loadFeed);

    $rootScope.$on('newPost',
      function (event, args) {
        var post = args.newPost;
        $scope.newPost = post;

        var description = post.description;

        handlePosts([post]);
        $scope.posts.unshift(post);

        if (post.image) {
          var message = "";
          var imgHTML = '<div id="image"></div>';
        } else {
          var message = "No image";
          var imgHTML = '<span data-notify="message"><small>{2}</small></span>';
        }
        var body = $sce.trustAsHtml('<b>' + description + '</b>')


        $.notify({
          title: body,
          message: message,
        }, {
          placement: {
            from: 'bottom',
            align: 'right'
          },
          delay: 10000,
          mouse_over: 'pause',
          template: '<div data-notify="container" id="piece-of-shit" class="col-xs-11 col-sm-3 alert alert-{0}" role="alert">' +
          '<button type="button" aria-hidden="true" class="close" data-notify="dismiss">×</button>' +
          '<span data-notify="icon"></span> ' +
          '<span data-notify="title">{1}</span><br> ' +
          imgHTML + '<br><br>' +
          '<div id="delete-button"></div>' +
          '</div>',
          onShown: function () {
            if ($scope.newPost.image) {
              $('#piece-of-shit').find('#image').replaceWith(
                $compile('<img id="image" src="' + $scope.newPost.image + '" ng-click="openImage(newPost)" width="200">')($scope)
              );
            }
            $('#piece-of-shit').find('#delete-button').replaceWith(
              $compile('<a href="javascript:;" id="delete-button" data-notify="dismiss" class="btn btn-danger" ng-click="deletePost(newPost)"' +
                'ladda="newPost.deletingPost" data-style="zoom-out">' +
                'Delete </a>')($scope)
            );
          }
        });
      }
    );

    $scope.openImage = function (p) {
      $window.open(p.image, '_blank');
    };

    $scope.loadMorePosts = function () {
      if (! $scope.cursor) return;

      var req = $scope.tag ?
        Post.loadMoreFromTag($scope.tag, $scope.cursor) :
        Post.loadMore($scope.deletedActive, $scope.cursor);

      req.success(handleMore);
    };

    function handleMore(data) {
      var more = data.posts;
      $scope.cursor = $scope.tag ? data.next_page_cursor : data.page_cursor;

      if (more.length === 0) {
        $scope.pauseScroll = true;
        return
      }
      handlePosts(more);
      $scope.posts.push.apply($scope.posts, more);
    }

    $scope.deletePost = function (p) {
      p.deletingPost = true;

      Post.delete(p)
        .success(function (data, status) {
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
        .success(function (data, status) {
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
          .success(function (data, status) {
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

  .controller('ModalCtrl', function ($scope, $modalInstance) {
    $scope.ok = function (block) {
      $modalInstance.close(block);
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
  });
