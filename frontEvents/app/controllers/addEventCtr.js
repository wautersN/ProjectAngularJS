angular.module('events.addevent', ['ngRoute'])
    .config(['$stateProvider',
        '$urlRouterProvider',
        function($stateProvider, $urlRouterProvider) {

            $stateProvider

                .state('addevent', {
                url: '/addevent',
                views: {
                    'nav@': {
                        controller: 'NavCtrl',
                        templateUrl: '/templates/nav.tmpl.html'
                    },
                    'events@': {
                        templateUrl: 'templates/addEvent.tmpl.html',
                        controller: 'AddEventCtrl'
                    }
                }

            });
        }
    ])
    .controller('AddEventCtrl', ['$scope', 'events', '$http', 'auth',
        function($scope, events, $http, auth) {
            $scope.items = [{
                name: 'Oost-Vlaanderen'
            }, {
                name: 'Antwerpen'
            }, {
                name: 'Limburg'
            }, {
                name: 'West-Vlaanderen'
            }, {
                name: 'Vlaams-Brabant'
            }];

            $scope.selectedItem = null;

            $scope.addPost = function(isValid) {
                if (isValid) {

                    var dataObj = {
                        name: $scope.name,
                        date: $scope.dt,
                        streetname: $scope.streetname,
                        postalcode: $scope.postalcode,
                        town: $scope.town,
                        region: $scope.selectedItem.name,
                        description: $scope.description,
                        placename: $scope.placename,
                        rating: 0
                    };

                    var res = $http.post(server + '/events', dataObj, {
                        headers: {
                            Authorization: 'Bearer ' + auth.getToken()
                        }
                    });


                    location.reload();
                } else {
                    return;
                }
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
