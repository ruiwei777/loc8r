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

		ctrl.$onInit = $onInit;
		ctrl.getNumber = getNumber;
		ctrl.getNumberReverse = getNumberReverse;
		ctrl.onSearch = onSearch;

		function $onInit(){
			$(".loading-index").css("display", "none");
		}

		// two helper functions for displaying rating stars
		function getNumber(upper) {
			return new Array(Math.floor(upper));
		}

		function getNumberReverse(upper) {
			return new Array(5 - Math.floor(upper));
		}

		function onSearch(event){
			if (event.which === 13){
				$('html, body').animate({
					scrollTop: $(".list-group").offset().top-40
			}, 1000);
			}
		}
	}
})();