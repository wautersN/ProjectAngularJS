var app = angular.module('events', ['ngAnimate', 'ui.bootstrap', 'ngMessages', 'ui.router']);

app.config(['$stateProvider',
    '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        $stateProvider
        .state('home', {
            url: '/home',
            templateUrl: '/home.html',
            controller: 'MainCtrl',
            resolve: {
                postPromise: ['events',
                    function(events) {
                        return events.getAll();
                    }
                ]
            }
        })

        .state('event', {
                url: '/event/{id}',
                templateUrl: '/event.html',
                controller: 'EventCtrl',
                resolve: {
                    event: ['$stateParams', 'events',
                        function($stateParams, events) {
                            return events.get($stateParams.id);
                        }
                    ]

                }
            })

        .state('addevent', {
                url: '/addevent',
                templateUrl: '/addevent.html',
                controller: 'AddEventCtrl'
            })

        .state('login', {
                url: '/login',
                templateUrl: '/login.html',
                controller: 'AuthCtrl',
                onEnter: ['$state', 'auth',
                    function($state, auth) {
                        if (auth.isLoggedIn()) {
                            $state.go('home');
                        }
                    }
                ]

            })

        .state('register', {
                url: '/register',
                templateUrl: '/register.html',
                controller: 'AuthCtrl',
                onEnter: ['$state', 'auth',
                    function($state, auth) {
                        if (auth.isLoggedIn()) {
                            $state.go('home');
                        }
                    }
                ]

            });

        $urlRouterProvider.otherwise('home');
    }
]);

var server = 'https://eventsbackend.herokuapp.com';
//var server = 'http://localhost:8080';

app.factory('auth', ['$http', '$window',
    function($http, $window) {
        var auth = {};

        auth.saveToken = function(token) {
            $window.localStorage['event-token'] = token;
        };

        auth.getToken = function() {
            return $window.localStorage['event-token'];
        };

        auth.isLoggedIn = function() {
            var token = auth.getToken();

            if (token) {
                var payload = JSON.parse($window.atob(token.split('.')[1]));

                return payload.exp > Date.now() / 1000;
            } else {
                return false;
            }
        };

        auth.currentUser = function() {
            if (auth.isLoggedIn()) {
                var token = auth.getToken();
                var payload = JSON.parse($window.atob(token.split('.')[1]));

                return payload.username;
            }
        };

        auth.register = function(user) {
            return $http.post(server + '/register', user).success(function(data) {
                auth.saveToken(data.token);
            });
        };

        auth.logIn = function(user) {
            return $http.post(server + '/login', user).success(function(data) {
                auth.saveToken(data.token);
            });
        };

        auth.logOut = function() {
            $window.localStorage.removeItem('event-token');
        };

        return auth;
    }
]);

app.controller('NavCtrl', ['$scope', 'auth',
    function($scope, auth) {
        $scope.isLoggedIn = auth.isLoggedIn;
        $scope.currentUser = auth.currentUser;
        $scope.logOut = auth.logOut;
    }
]);

app.controller('AuthCtrl', ['$scope', '$state', 'auth',
    function($scope, $state, auth) {
        $scope.user = {};

        $scope.register = function() {
            auth.register($scope.user).error(function(error) {
                $scope.error = error;
            }).then(function() {
                $state.go('home');
            });
        };

        $scope.logIn = function() {
            auth.logIn($scope.user).error(function(error) {
                $scope.error = error;
            }).then(function() {
                $state.go('home');
            });
        };
    }
]);

app.factory('events', ['$http', 'auth', function($http, auth) {
    var o = {
        events: []
    };

    o.getAll = function() {
        return $http.get(server + '/events').success(function(data) {
            angular.copy(data, o.events);
        });
    };

    o.get = function(id) {
        return $http.get(server + '/events/' + id, {
            headers: {
                Authorization: 'Bearer ' + auth.getToken()
            }
        }).then(function(res) {
            return res.data;
        });
    };
    return o;
}]);



app.controller('MainCtrl', ['$scope', 'events', function($scope, events) {
    $scope.data = events.events;

}]);

app.directive('starRating',
    function() {
        return {
            restrict: 'A',
            template: '<ul class="rating">' +
             '    <li ng-repeat="star in stars" ng-class="star" ng-click="toggle($index)">' +
             ' <p style="  font-size: 41px;" class="glyphicon glyphicon-star" aria-hidden="true"/>' +
             '</li>' + '</ul>',
            scope: {
                ratingValue: '=',
                max: '=',
                onRatingSelected: '&'
            },
            link: function(scope, elem, attrs) {
                var updateStars = function() {
                    scope.stars = [];
                    for (var i = 0; i < scope.max; i++) {
                        scope.stars.push({
                            filled: i < scope.ratingValue
                        });
                    }
                };

                scope.toggle = function(index) {
                    scope.ratingValue = index + 1;
                    scope.onRatingSelected({
                        rating: index + 1
                    });
                };

                scope.$watch('ratingValue',
                    function(oldVal, newVal) {
                        if (newVal) {
                            updateStars();
                        }
                    }
                );
            }
        };
    }
);

app.controller('AddEventCtrl', ['$scope', 'events', '$http', 'auth',
    function($scope, events, $http, auth) {
        $scope.items = [{ name: 'Oost-Vlaanderen' },
                        { name: 'Antwerpen' },
                        { name: 'Limburg' },
                        { name: 'Oost-Vlaanderen' },
                        { name: 'Vlaams-Brabant' }];

        $scope.selectedItem = null;

        $scope.addPost = function(isValid) {
            if (isValid) {

                var dataObj = {
                    name:        $scope.name,
                    date:        $scope.dt,
                    streetname:  $scope.streetname,
                    postalcode:  $scope.postalcode,
                    town:        $scope.town,
                    region:      $scope.selectedItem.name,
                    description: $scope.description,
                    placename:   $scope.placename,
                    rating: 0
                };

                var res = $http.post(server + '/events', dataObj, {
                    headers: {
                        Authorization: 'Bearer ' + auth.getToken()
                    }
                });


                location.reload();
            } else { return; }
        };


        $scope.today = function() {
            $scope.dt = new Date();
        };

        $scope.today();

        $scope.clear = function() {
            $scope.dt = null;
        };

        $scope.toggleMin = function() {
            $scope.minDate = $scope.minDate ? null : new Date();
        };
        $scope.toggleMin();


        $scope.open = function($event) {
            $scope.status.opened = true;
        };

        $scope.setDate = function(year, month, day) {
            $scope.dt = new Date(year, month, day);
        };

        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1
        };

        $scope.status = {
            opened: false
        };

        var tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        var afterTomorrow = new Date();
        afterTomorrow.setDate(tomorrow.getDate() + 2);
        $scope.events = [{
            date: tomorrow,
            status: 'full'
        }, {
            date: afterTomorrow,
            status: 'partially'
        }];

        $scope.getDayClass = function(date, mode) {
            if (mode === 'day') {
                var dayToCheck = new Date(date).setHours(0, 0, 0, 0);

                for (var i = 0; i < $scope.events.length; i++) {
                    var currentDay = new Date($scope.events[i].date).setHours(0, 0, 0, 0);

                    if (dayToCheck === currentDay) {
                        return $scope.events[i].status;
                    }
                }
            }
            return '';
        };
    }
]);

app.controller('EventCtrl', ['$scope', 'events', 'event', '$http', 'auth', function($scope, events, event, $http, auth) {
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
