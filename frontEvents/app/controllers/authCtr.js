angular.module('events.auth', ['ngRoute'])
    .config(['$stateProvider',
        '$urlRouterProvider',
        function($stateProvider, $urlRouterProvider) {

            $stateProvider

                .state('login', {
                url: '/login',
                views: {
                    'nav@': {
                        controller: 'NavCtrl',
                        templateUrl: '/templates/nav.tmpl.html'
                    },
                    'events@': {
                        templateUrl: 'templates/login.tmpl.html',
                        controller: 'AuthCtrl',
                        onEnter: ['$state', 'auth',
                            function($state, auth) {
                                if (auth.isLoggedIn()) {
                                    $state.go('home');
                                }
                            }
                        ]
                    }
                }



            })

            .state('register', {
                url: '/register',
                views: {
                    'nav@': {
                        controller: 'NavCtrl',
                        templateUrl: '/templates/nav.tmpl.html'
                    },
                    'events@': {
                        templateUrl: 'templates/register.tmpl.html',
                        controller: 'AuthCtrl',
                        onEnter: ['$state', 'auth',
                            function($state, auth) {
                                if (auth.isLoggedIn()) {
                                    $state.go('home');
                                }
                            }
                        ]
                    }
                }


            });
        }
    ])
    .controller('AuthCtrl', ['$scope', '$state', 'auth',
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
