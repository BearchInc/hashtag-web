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

            .state('feed-deleted', {
              url: '/feed-deleted',
              views: viewsWithMenu({
                templateUrl: '/public/views/feed_deleted.html',
                controller: 'FeedDeletedCtrl',
              }),
            })
          }
  ])
  .run(function ($rootScope, $state) {
    $rootScope.$state = $state;
  });
