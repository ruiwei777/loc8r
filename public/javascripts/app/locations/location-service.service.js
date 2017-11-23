(function () {

  angular.module('locationService', ['constants'])
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

