angular.module('Controllers')

.controller('TrendingsNew', function ($scope, Trending, Flash) {
  $scope.trending = {};

  $scope.create = function(trending) {
    Trending.create(trending).success(function(data, status) {
      if(status != 201) {
        Flash.create('danger', 'Error: ' + data);
        return;
      }
      Flash.create('success', 'Trending successfully created');
    })

    .error(function(data, status, headers, config) {
      Flash.create('danger', 'Error: ' + data);
    });
  };

});


