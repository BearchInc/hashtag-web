angular.module('Models')

.factory('Post', function ($http, HOST) {
  var Post = function () {};

  Post.all = function () {
    return $http.get(HOST + '/posts');
  };

  Post.deleted = function () {
    return $http.get(HOST + '/posts?deleted=true');
  };

  Post.delete = function (post) {
    return $http.delete(HOST + post.path);
  };

  Post.restore = function (post) {
    return $http.post(HOST + post.path);
  };

  return Post;
});
