angular.module('Models')

.factory('Account', function () {
  var Account = function() {
    this.role = Account.roles[0].value;
  };

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
