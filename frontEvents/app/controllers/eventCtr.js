angular.module('events.event', ['ngRoute'])
.config(['$stateProvider',
    '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
       
      $stateProvider
       
       .state('event', {
                url: '/event/{id}',
                views: {
                   'nav@': {
                        controller: 'NavCtrl',
                        templateUrl: '/templates/nav.tmpl.html'
                    },
                    'events@': {
                        templateUrl: 'templates/event.tmpl.html',
                controller: 'EventCtrl',
                resolve: {
                    event: ['$stateParams', 'events',
                        function($stateParams, events) {
                            return events.get($stateParams.id);
                        }
                    ]

                }
                    }
                }


                
            });
    }
])
.controller('EventCtrl', ['$scope', 'events', 'event', '$http', 'auth', function($scope, events, event, $http, auth) {
    $scope.event = event;
    
    $scope.rating = event.rating;
    if ($scope.rating === 0) {
        $scope.rating = 5;
    }

    $scope.rateFunction = function(rating) {

        $http.post(server + '/events/' + event._id + '/score', {
            rating: rating
        }, { headers: { Authorization: 'Bearer ' + auth.getToken()}
        }).success(function(data) {
            console.log("gaat");
        });

    };
    $scope.addArtist = function(isValid) {
        if (isValid) {



            var dataObj = {
                artistname: $scope.artistname
            };

            var res = $http.post(server + '/events/' + event._id + '/artist', dataObj, {
                headers: { Authorization: 'Bearer ' + auth.getToken()}
            });

            $scope.artistname = '';
            location.reload();
        } else { return; }
    };
}]);