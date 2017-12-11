(function () {
	angular.module('loc8r')
		.config(['$stateProvider', '$locationProvider', '$urlRouterProvider', function ($stateProvider, $locationProvider, $urlRouterProvider, $templateRequestProvider) {
			var locationListState = {
				name: "locations",
				url: "/locations",
				component: "locationList",
				resolve: {
					locations: function (locationService) {
						return locationService.list();
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

			var notFoundState = {
				name: "404",
				url: "*path",
				component: "notFound"
			}





			$stateProvider
				.state(locationListState)
				.state(locationDetailState)
				.state(locationCreateState)
				.state(aboutState)
				.state(notFoundState);

			$locationProvider.html5Mode(true);

			// index redirect
			$urlRouterProvider.when("/", ['$state', '$match', function ($state, $match) {
				$state.go('locations');

			}]);

		}]);
})();


