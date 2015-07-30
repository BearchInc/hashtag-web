angular.module('Models')

.factory('Trending', function ($http, Roles, RolesOptions) {
  var Trending = {};

  Trending.all = function () {
    return $http.get(HOST + '/tags/trending');
  };

  Trending.get = function (id) {
    return $http.get(HOST + '/tags/trending/' + id);
  };

  Trending.update = function (trending) {
    trending.rank = parseInt(trending.rank, 10);
    return $http.patch(HOST + '/tags/trending', trending);
  };

  Trending.delete = function (id) {
    return $http.delete(HOST + '/tags/trending/' + id);
  };

  Trending.create = function (trending) {
    trending.rank = parseInt(trending.rank, 10);
    return $http.post(HOST + '/tags/trending', trending);
  };

  return Trending;
});
