angular.module('Models')

.factory('Account', function ($http, Roles, RolesOptions) {
  var Account = function() {
    this.role = Roles.Moderator;
  };

  Account.prototype.create = function () {
    this.role = parseInt(this.role, 10);
    return $http.post(HOST + '/accounts', this);
  };

  Account.prototype.isAdmin = function () {
    console.log(this.role)
    console.log(Roles.Admin)
    return this.role === Roles.Admin;
  };

  Account.current = function () {
    var storedAccount = JSON.parse(localStorage.getItem('account'))
    if (!storedAccount)
      return

    var account = new Account();
    account.id = storedAccount.id;
    account.role = storedAccount.role;

    return account;
  };


  /**
   * Account Roles
   */
  Account.rolesOptions = RolesOptions(Roles);

  return Account;
})

.constant('Roles', {
  Moderator: 1,
  Admin: 2,
})

.constant('RolesOptions', function(Role) {
  return [
    {
      name: 'Moderator',
      value: Role.Moderator
    },
    {
      name: 'Administator',
      value: Role.Admin
    }
  ];
})
;
