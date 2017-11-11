(function () {

  angular.module('locationService', ['constants'])
    // .factory('getLocations', ['$http', 'API_ROOT', function ($http, API_ROOT) {
    //   var config = {
    //     params: {
    //       lng: '-0.799',
    //       lat: '51.37',
    //       maxDistance: '200000'
    //     }
    //   }

    //   return function () {
    //     return $http.get(API_ROOT + '/api/locations', config);
    //   };
    // }])
    // .factory('getLocation', ['$http', function ($http) {
    //   return function (locationId) {
    //     var url = API_ROOT + '/api/locations/' + locationId;
    //     return $http.get(url);
    //   }
    // }])
    // .factory('create', ['$http', function ($http) {
    //   return function (data) {
    //     delete data._id;
    //     var url = API_ROOT + '/api/locations/';
    //     return $http.post(url, data);
    //   }
    // }])
    // .factory('deleteLocation', ['$http', function ($http) {
    //   return function (locationId) {
    //     var url = API_ROOT + "/api/locations/" + locationId;
    //     return $http.delete(url);
    //   }
    // }])
    .factory('locationService', ['$http', 'API_ROOT', function ($http, API_ROOT) {
      return function () {
        var baseUrl = API_ROOT + '/api/locations/';
        var service = {};
        service.create = create;
        service.getAll = getAll;
        service.get = get;
        service.delete = del;

        function create(data) {
          delete data._id;
          return $http.post(baseUrl, data);
        }

        function getAll() {
          var config = {
            params: {
              lng: '-0.799',
              lat: '51.37',
              maxDistance: '200000'
            }
          };
          return $http.get(baseUrl, config);
        }

        function get(locationId) {
          var url = baseUrl + locationId;
          return $http.get(url);
        }

        function del(locationId){
          var url = baseUrl + locationId;
          return $http.delete(url);
        }


        return service;
      }

    }])
    ;
})();

