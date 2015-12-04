angular.module('events.eventsF', ['ngRoute'])
.factory('events', ['$http', 'auth', function($http, auth) {
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
