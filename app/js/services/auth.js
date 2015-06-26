angular.module('Services')

.service('Auth', function ($http, HOST, $rootScope, Account) {
  var self = this;

  this.authenticate = function (credentials) {
    return $http.post(HOST + '/login', credentials).then(function(response) {
      if (response.status === 200) {
        self.setAuthToken(btoa(response.data.auth_token));
        localStorage.setItem('account', JSON.stringify(response.data))
        $rootScope.currentAccount = Account.current()
      }
    });
  };

  this.authenticated = function () {
    return localStorage.getItem('authToken') !== '';
  };

  this.logout = function () {
    var token = localStorage.getItem('authToken');
    $http.delete('/web/logout').success(function () {
      this.setAuthToken('');
    });
  };

  this.authToken = function () {
    return localStorage.getItem('authToken');
  };

  this.setAuthToken = function(authToken) {
    localStorage.setItem('authToken', authToken);
  };
});
