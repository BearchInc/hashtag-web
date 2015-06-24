angular.module('Routes')

  .config(['$stateProvider', '$urlRouterProvider',
          function ($stateProvider, $urlRouterProvider) {
            $urlRouterProvider.otherwise('/feed');

            function viewsWithMenu(bodyView) {
              return {
                menu: {
                  templateUrl: '/public/views/menu.html',
                  controller: 'MenuCtrl',
                },
                body: bodyView
              };
            }

            $stateProvider

            .state('feed', {
              url: '/feed',
              views: viewsWithMenu({
                templateUrl: '/public/views/feed.html',
                controller: 'FeedCtrl',
              }),
            })

            .state('/signUp', {
              url: '/signUp',
              views: viewsWithMenu({
                templateUrl: '/public/views/signUp.html',
                controller: 'UserCtrl',
              }),
            })

            .state('login', {
              url: '/login',
              views: {
                body: {
                  templateUrl: '/public/views/login.html',
                  controller: 'LoginCtrl',
                },
              },
            })
          }

  ])

  .run(function ($rootScope, $state, Auth) {
    $rootScope.$on('$stateChangeStart', function(event, toState) {
      if (!Auth.authToken()) {
        $state.transitionTo('login');
        event.preventDefault();
      }
    });

    $rootScope.$state = $state;
  });
