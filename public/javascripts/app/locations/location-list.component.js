(function () {

	angular.module('locations')
		.component('locationList', {
			templateUrl: 'location-list.html',
			controller: [LocationListController],
			controllerAs: 'listCtrl',
			bindings: {
				locations: '<'
			}
		});

	function LocationListController() {
		var ctrl = this;

		ctrl.getNumber = getNumber;
		ctrl.getNumberReverse = getNumberReverse;

		// two helper functions for displaying rating stars
		function getNumber(upper) {
			return new Array(Math.floor(upper));
		}

		function getNumberReverse(upper) {
			return new Array(5 - Math.floor(upper));
		}
	}
})();