(function () {
	angular.module('loc8r')
		.config(['$stateProvider', '$locationProvider', '$urlRouterProvider', '$templateRequestProvider', function ($stateProvider, $locationProvider, $urlRouterProvider, $templateRequestProvider) {
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





			$stateProvider
				.state(locationListState)
				.state(locationDetailState)
				.state(locationCreateState)
				.state(aboutState);

			$locationProvider.html5Mode(true);

			// index redirect
			$urlRouterProvider.when("/", ['$state', '$match', function ($state, $match) {
				$state.go('locations');

			}]);

			// set header when requesting templates for ui-router
			$templateRequestProvider.httpOptions({
				headers: { Accept: 'text/html' }
			});
		}]);
})();


