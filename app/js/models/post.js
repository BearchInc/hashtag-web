angular.module('Models')

  .factory('Post', function ($http) {
    var Post = {};

    Post.get = function () {
      return $http.get('/posts');
    };

    Post.deleted = function () {
      return $http.get('/posts?deleted=true');
    };

    return Post;
  });
