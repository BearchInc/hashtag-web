angular.module('Models')

.factory('Account', function ($http) {
  var Account = function() {
    this.role = 1;
  };

  Account.prototype.create = function () {
    this.role = parseInt(this.role, 10);
    return $http.post(HOST + '/accounts', this);
  }

  Account.roles = [
    {
      name: 'Moderator',
      value: 1
    },
    {
      name: 'Administator',
      value: 2
    }
  ];

  return Account;
});
