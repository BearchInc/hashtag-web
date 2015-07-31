angular.module('Controllers')

.controller('TrendingsEdit', function ($scope, $stateParams, Trending, Flash) {
  $scope.trending = {};

  Trending.get($stateParams.id).success(function(data) {
    $scope.trending = data;
  })

  $scope.update = function(trending) {
    Trending.update(trending).success(function(data, status) {
      Flash.create('success', 'Trending successfully updated');
    })

    .error(function(data, status, headers, config) {
      Flash.create('danger', 'Error: ' + data);
    });
  };

});


