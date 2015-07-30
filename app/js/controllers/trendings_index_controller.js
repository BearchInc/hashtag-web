angular.module('Controllers')

.controller('TrendingsIndex', function ($scope, Trending, Flash) {
  $scope.trendings = {};

  var removeCommentFromView = function (idx) {
    $scope.trendings.splice(idx, 1);
  };

  Trending.all().success(function(data) {
    $scope.trendings = data;
  });

  $scope.delete = function(id, idx) {
    Trending.delete(id).then(function(data) {
      removeCommentFromView(idx);
    });
  }
});


