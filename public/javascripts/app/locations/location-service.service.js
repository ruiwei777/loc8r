(function () {

  angular.module('locationService', ['constants'])
    .factory('locationService', ['$http', 'API_ROOT', function ($http, API_ROOT) {
      var baseUrl = API_ROOT + '/api/locations/';
      var service = {};

      service.create = function (data) {
        delete data._id;
        return $http.post(baseUrl, data);
      };

      service.list = function (lng, lat, maxDistance) {
        var config = {
          params: {
            lng: lng || '145.044',
            lat: lat || '-37.877',
            maxDistance: maxDistance || '200000'
          }
        };
        return $http.get(baseUrl, config);
      };

      service.get = function (locationId) {
        var url = baseUrl + locationId;
        return $http.get(url);
      };

      service.delete = function (locationId) {
        var url = baseUrl + locationId;
        return $http.delete(url);
      }







      return service;
    }]);

})();

