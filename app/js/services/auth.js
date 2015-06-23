angular.module('Services')

.service('Auth', function ($http) {
  this.authenticate = function (credentials) {
    return $http.post('/web/login', credentials).then(function(response) {
      if (response.status === 200) {
        localStorage.setItem('authToken', response.data.token);
        localStorage.setItem('userPermissions', JSON.stringify(response.data.userPermissions));
      }
    });
  };

  // TODO move to CurrentUser
  this.authenticated = function () {
    return localStorage.getItem('authToken') !== '';
  };

  this.logout = function () {
    var token = localStorage.getItem('authToken');
    $http.delete('/web/logout').success(function () {
      localStorage.setItem('authToken', '');
    });
  };

  // TODO move to CurrentUser
  this.authToken = function () {
    return localStorage.getItem('authToken');
  };
});
