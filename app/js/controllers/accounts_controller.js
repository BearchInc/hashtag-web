angular.module('Controllers')

.controller('AccountsCreate', function ($scope, Account, Flash) {
  $scope.roles = Account.roles;
  $scope.account = new Account();

  $scope.createAccount = function() {
    $scope.account.create()
      .success(function(data, status, headers, config) {
        if (status !== 200) {
          Flash.create('danger', 'Err: ' + data);
          return;
        }

        $scope.AccountForm.$setPristine();
        $scope.account = new Account();

        Flash.create('success', 'Account successfully created');
      })

      .error(function(data, status, headers, config) {
        Flash.create('danger', 'Error: ' + data);
      });
  };

});


