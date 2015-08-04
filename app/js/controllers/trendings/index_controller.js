angular.module('Controllers')

.controller('TrendingsIndex', function ($scope, Trending, Flash) {
  $scope.trendings = {};

  var removeTagFromView = function (idx) {
    $scope.trendings.splice(idx, 1);
  };

  $scope.update = function(item, partFrom, partTo, indexFrom, indexTo) {
    $scope.trendings.forEach(function (trending, index) {
      trending.rank = index + 1;
    });

    Trending.batchUpdate($scope.trendings).success(function(data, status) {
      if(status != 200) {
        Flash.create('danger', 'Error: ' + data);
        return;
      }
      Flash.create('success', 'Trendings successfully updated');
    })

    .error(function(data, status, headers, config) {
      Flash.create('danger', 'Error: ' + data);
    });
  }

  Trending.all().success(function(data) {
    $scope.trendings = data;
  });

  $scope.delete = function(id, idx) {
    Trending.delete(id).then(function(data) {
      removeTagFromView(idx);
    });
  }
});


