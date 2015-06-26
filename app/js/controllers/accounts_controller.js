angular.module('Controllers')

.controller('Accounts_Create', function ($scope, $http, Account, Flash) {
  $scope.roles = Account.roles;
  $scope.account = new Account();

  $scope.createAccount = function() {
    $http.post(HOST + '/accounts', $scope.account)

    .success(function(data, status, headers, config) {
      if (status !== 200) {
        Flash.create('danger', 'Err: ' + data);
        return;
      }

      $scope.account = new Account();
      $scope.AccountForm.$setPristine();

      Flash.create('success', 'Account successfully created');
    })

    .error(function(data, status, headers, config) {
      Flash.create('danger', 'Error: ' + data);
    });
  };

});


