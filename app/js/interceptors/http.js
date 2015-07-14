angular.module('Interceptors')

  .config(function ($httpProvider) {
    $httpProvider.interceptors.push(function ($injector) {
      return {
        responseError: function (response) {
          if (response.status === 401) {
            $injector.get('$state').transitionTo('login');
          }
          return response;
        },

        request: function (config) {
          var Auth = $injector.get('Auth');
          if (Auth.authToken()) {
            config.headers['Authorization'] = "Basic " + Auth.authToken();
          }

          return config
        }
      }
    });
  });


