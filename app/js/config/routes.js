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

            .state('trendings', {
              url: '/trendings',
              authenticate: true,
              views: viewsWithMenu({
                templateUrl: '/public/views/trendings/index.html',
                controller: 'TrendingsIndex',
              }),
            })

            .state('trendings-new', {
              url: '/trendings/new',
              authenticate: true,
              views: viewsWithMenu({
                templateUrl: '/public/views/trendings/new.html',
                controller: 'TrendingsNew',
              }),
            })

            .state('trendings-edit', {
              url: '/trendings/:id/edit',
              authenticate: true,
              views: viewsWithMenu({
                templateUrl: '/public/views/trendings/edit.html',
                controller: 'TrendingsEdit',
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

      openChannel($http, $rootScope);
    });

    $rootScope.$state = $state;
  });



var connected = false;

function openChannel ($http, $rootScope) {
  if (connected) return;

  $http.post(HOST + "/channel/new").success(function(data) {
    var socket = new goog.appengine.Channel(data.token).open();

    socket.onopen = function() {
      connected = true;
    };

    socket.onmessage = function(data) {
      var post = JSON.parse(data.data);
      $rootScope.$broadcast('newPost', {newPost: post});
    };

    socket.onerror = function(err) {
      console.log("socket err:");
      console.log(err);
    };

    socket.onclose = function() {
    };
  });
}
