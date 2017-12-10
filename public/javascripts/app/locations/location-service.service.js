(function () {
  angular.module('locationService', ['constants'])
    .factory('locationService', ['$http', 'API_ROOT', function ($http, API_ROOT) {
      // now using http-proxy-middleware, API_ROOT is no longer needed
      var baseUrl = '/api/locations/';
      var service = {};

      service.create = function (data) {
        delete data._id;
        return $http.post(baseUrl, data);
      };

      service.list = function (lng, lat, maxDistance) {
        return $http.get(baseUrl);
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
    }])
    /**
     * https://docs.angularjs.org/api/ngResource/service/$resource
     * Usage example:
     * Review.delete({locatonId: locationId, reviewId: reviewId}, success)
     * Review.query({locationId: locationId})    - usually not needed
     * Review.get({locationId: locationId, reviewId: reviewId})
     * Review.save({locationId: locatonId}, postData, success)
     */
    .factory('Review', ['$resource', 'API_ROOT', function($resource, API_ROOT){
      var url = '/api/locations/:locationId/reviews/:reviewId/'
      var Review = $resource(url);
      return Review;
    }])
    ;

})();

