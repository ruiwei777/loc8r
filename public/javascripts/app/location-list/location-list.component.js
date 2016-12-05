(function(){
	var LocationListController = function($scope, getLocations){
		var ctrl = this;

		ctrl.locations = [];
		ctrl.message = "Searching for nearby places...";

		getLocations.success(function(data){
			ctrl.message = data.length ? "" : "No locations found.";
			ctrl.locations = data;

			ctrl.locations.forEach(function(location){
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
		})
		.error(function(e){
			ctrl.message = "Sorry, something goes wrong with the request.";
		});

		


	};

	angular.module('locationList').component('locationList', {
		templateUrl: '/templates/location-list.html',
		controller: ['$scope', 'getLocations', LocationListController],
		controllerAs: 'listCtrl',
		bindings: {
			searchText: '<'
		}





	})





})();