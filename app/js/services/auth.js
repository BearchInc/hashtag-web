angular.module('Services')

.service('Auth', function ($http, HOST) {
  this.authenticate = function (credentials) {
    return $http.post(HOST + '/login', credentials).then(function(response) {
      if (response.status === 200) {
        this.setAuthToken(response.data.auth_token);
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
