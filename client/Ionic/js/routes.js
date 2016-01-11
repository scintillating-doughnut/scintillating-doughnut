angular.module('SD.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

    .state('joinGame', {
      url: '/joinGame',
      templateUrl: 'templates/joinGame.html',
      controller: 'gameCtrl'
    })

    .state('mainView', {
      url: '/mainView',
      templateUrl: 'templates/mainView.html',
      controller: 'gameCtrl'
    })
    .state('playerView', {
      url: '/playerView',
      templateUrl: 'templates/playerView.html',
      controller: 'gameCtrl'
    })

    ;

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/joinGame');

});