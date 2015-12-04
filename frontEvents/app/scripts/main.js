var server = 'https://eventsbackend.herokuapp.com';
//var server = 'http://localhost:8080';
var app = angular.module('events', [
        'ngAnimate',
        'ui.bootstrap',
        'ngMessages',
        'ui.router',
        'ngRoute',
        'events.main',
        'events.nav',
        'events.auth',
        'events.event',
        'events.addevent',
        'events.starD',
        'events.authF',
        'events.eventsF'
    ])
    .config(['$stateProvider',
        '$urlRouterProvider',
        function($stateProvider, $urlRouterProvider) {
            $urlRouterProvider.otherwise('home');
        }
    ]);







