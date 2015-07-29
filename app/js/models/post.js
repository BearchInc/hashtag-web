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

  Post.loadMoreFromTag = function(tag, cursor) {
    return $http.get(HOST + '/feeds/' + tag + '?next_page_cursor=' + cursor);
  }

  Post.loadMore = function (deleted, cursor) {
    return $http.get(HOST + '/posts?deleted=' + deleted + '&page_cursor=' + cursor);
  }

  return Post;
});
