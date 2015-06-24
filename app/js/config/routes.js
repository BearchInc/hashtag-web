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

  }
])

.run(function ($rootScope, $state) {
  $rootScope.$state = $state;
});
