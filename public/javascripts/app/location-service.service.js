(function () {

  angular.module('locationService', [])
    .factory('getLocations', ['$http', function ($http) {
      var config = {
        params: {
          lng: '-0.799',
          lat: '51.37',
          maxDistance: '200000'
        }
      }

      return function () {
        return $http.get('/api/locations', config);
      };
    }])
    .factory('getLocation', ['$http', function ($http) {
      return function (locationId) {
        var url = '/api/locations/' + locationId;
        return $http.get(url);
      }
    }])
    .factory('create', ['$http', function ($http) {
      return function (data) {
        delete data._id;
        var url = '/api/locations/';
        return $http.post(url, data);
      }
    }])
    .factory('deleteLocation', ['$http', function ($http) {
      return function (locationId) {
        var url = `/api/locations/${locationId}`;
        return $http.delete(url);
      }
    }])
    ;
})();

