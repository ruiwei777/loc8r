(function(){
	angular.module('loc8r')
	.config(['$stateProvider','$locationProvider','$urlRouterProvider', function($stateProvider, $locationProvider, $urlRouterProvider){
		var locationListState = {
			name: "locations",
			url: "/locations",
			component: "locationList",
			resolve: {
				locations: function(getLocations){
					return getLocations();
				}
			}
		}

		var locationDetailState = {
			name: "locationDetail",
			url: "/locations/{locationId}",
			component: "locationDetail",
			params: {
				location: null
			}
		}

		var locationCreateState = {
			name: "locationCreate",
			url: "/locations/create",
			component: "locationCreate"
		}

		var aboutState = {
			name: "about",
			url: "/about",
			component: "about"
		}




		
		$stateProvider
			.state(locationListState)
			.state(locationDetailState)
			.state(locationCreateState)
			.state(aboutState);

		$locationProvider.html5Mode(true);
		
		// index redirect
		$urlRouterProvider.when("/", ['$state','$match', function ($state, $match) {
			$state.go('locations');

		}]);
	}]);






	
})();


