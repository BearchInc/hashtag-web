angular.module('Controllers')

.controller('TrendingsNew', function ($scope, Trending, Flash) {
  $scope.trending = {};

  $scope.create = function(trending) {
    Trending.create(trending).success(function(data, status) {
      Flash.create('success', 'Trending successfully created');
    })

    .error(function(data, status, headers, config) {
      Flash.create('danger', 'Error: ' + data);
    });
  };

});


