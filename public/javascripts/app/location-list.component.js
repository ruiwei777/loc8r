(function(){

	angular.module('locations', ['locationService', 'loading', 'ui.bootstrap'])

	.component('locationList', {
		templateUrl: '/templates/location-list.html',
		controller: [LocationListController],
		controllerAs: 'listCtrl',
		bindings: {
			locations: '<'
		}
	});

	function LocationListController(){
		var ctrl = this;

		if(ctrl.locations.data === undefined)
		ctrl.message = "Searching for nearby places...";

		if(ctrl.locations.data.length === 0)
		ctrl.message = "No locations found.";

		if(ctrl.locations.data.length){
			ctrl.message = "";
			ctrl.locations.data.forEach(function(location){
				var rating = location.rating;
				var stars = [];

				for(var i=0; i<rating; i++){
					stars.push(i);
				}
				location.stars = stars;

				var empty_stars = [];
				for(var i=0; i<(5-rating); i++){
					empty_stars.push(i);
				}
				location.empty_stars = empty_stars;
			});
		}
	}





})();