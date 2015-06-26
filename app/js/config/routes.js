angular.module('Routes')

  .config(['$stateProvider', '$urlRouterProvider',
          function ($stateProvider, $urlRouterProvider) {
            $urlRouterProvider.otherwise('/accounts');

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

  .run(function ($rootScope, $state, Auth) {
    $rootScope.$on('$stateChangeStart', function(event, toState) {
      if (toState.authenticate && !Auth.authToken()) {
        $state.transitionTo('login');
        event.preventDefault();
      }
    });

    $rootScope.$state = $state;
  });
