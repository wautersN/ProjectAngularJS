angular.module('events.main', ['ngRoute'])
.config(['$stateProvider',
    '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
       
      $stateProvider
       
       .state('home', {
            url: '/home',
             views: {
                   'nav@': {
                        controller: 'NavCtrl',
                        templateUrl: '/templates/nav.tmpl.html'
                    },
                    'events@': {
                         templateUrl: '/templates/events.tmpl.html',
                         controller: 'MainCtrl',
                         resolve: {
                             postPromise: ['events',
                                function(events) {
                              return events.getAll();
                          }
                             ]
                         }
                    }
                }
          
        });
    }
])
.controller('MainCtrl', ['$scope', 'events', function($scope, events) {
    $scope.data = events.events;

}]);