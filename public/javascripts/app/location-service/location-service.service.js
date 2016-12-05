angular.module('locationService').factory('getLocations', ['$http', function($http){
  var data = $http.get('/api/locations?lng=-0.799&lat=51.37&maxDistance=20000');

  return data;

  
}]);