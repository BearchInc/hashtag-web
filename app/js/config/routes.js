angular.module('Routes')

  .config(['$stateProvider', '$urlRouterProvider',
          function ($stateProvider, $urlRouterProvider) {
            $urlRouterProvider.otherwise('/posts');

            function viewsWithMenu(bodyView) {
              return {
                body: bodyView
              };
            }

            $stateProvider

            .state('posts', {
              url: '/posts',
              authenticate: true,
              views: viewsWithMenu({
                templateUrl: '/public/views/posts/index.html',
                controller: 'PostsIndex',
              }),
            })

            .state('accounts_new', {
              url: '/accounts/new',
              authenticate: true,
              views: viewsWithMenu({
                templateUrl: '/public/views/accounts/new.html',
                controller: 'AccountsCreate',
              }),
            })

            .state('login', {
              url: '/login',
              views: {
                body: {
                  templateUrl: '/public/views/application/login.html',
                  controller: 'LoginCtrl',
                },
              },
            })
          }

  ])

  .run(function ($rootScope, $state, Auth, $http) {
    $rootScope.$on('$stateChangeStart', function(event, toState) {
      if (toState.authenticate && !Auth.authToken()) {
        $state.transitionTo('login');
        event.preventDefault();

        return;
      }

      openChannel($http);
    });

    $rootScope.$state = $state;
  });



var connected = false;

function openChannel ($http) {
  if (connected) return;

  $http.post(HOST + "/channel/new").success(function(data) {
    var socket = new goog.appengine.Channel(data.token).open();

    socket.onopen = function() {
      connected = true;
    };

    socket.onmessage = function(data) {
      var post = JSON.parse(data.data);
      console.log(post);
    };

    socket.onerror = function(err) {
    };

    socket.onclose = function() {
    };
  });
}
