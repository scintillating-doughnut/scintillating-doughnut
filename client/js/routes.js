angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
    
      
        
    .state('login', {
      url: '/login',
      templateUrl: 'templates/login.html',
      controller: 'loginCtrl'
    })
        
      
    
      
        
    .state('ready', {
      url: '/ready',
      templateUrl: 'templates/ready.html',
      controller: 'readyCtrl'
    })
        
      
    
      
        
    .state('selectTeam', {
      url: '/select',
      templateUrl: 'templates/selectTeam.html',
      controller: 'selectTeamCtrl'
    })
        
      
    
      
        
    .state('approveTeam', {
      url: '/approve',
      templateUrl: 'templates/approveTeam.html',
      controller: 'approveTeamCtrl'
    })
        
      
    
      
        
    .state('onQuest', {
      url: '/page9',
      templateUrl: 'templates/onQuest.html',
      controller: 'onQuestCtrl'
    })
        
      
    
      
        
    .state('onQuest2', {
      url: '/page10',
      templateUrl: 'templates/onQuest2.html',
      controller: 'onQuest2Ctrl'
    })
        
      
    
      
        
    .state('teamSelection', {
      url: '/page11',
      templateUrl: 'templates/teamSelection.html',
      controller: 'teamSelectionCtrl'
    })
        
      
    
      
        
    .state('teamSelection2', {
      url: '/page12',
      templateUrl: 'templates/teamSelection2.html',
      controller: 'teamSelection2Ctrl'
    })
        
      
    ;

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');

});