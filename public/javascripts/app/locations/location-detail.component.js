(function () {

	angular.module('locations')
		.component('locationDetail', {
			templateUrl: 'location-detail.html',
			controller: ['$stateParams', '$state', 'locationService', 'Review', LocationDetailController],
			controllerAs: 'detailCtrl'
			// not using `resolve`, so no `bindings`
		});


	function LocationDetailController($stateParams, $state, locationService, Review) {
		var ctrl = this;

		ctrl.$onInit = $onInit;
		ctrl.getNumber = getNumber;
		ctrl.getNumberReverse = getNumberReverse;
		ctrl.onAddReview = onAddReview;
		ctrl.onDeleteReview = onDeleteReview;
		ctrl.onDelete = onDelete;
		ctrl.onGoBack = onGoBack;


		function $onInit() {
			// if user clicks into here, we use the data from parent control
			if ($stateParams.location) {
				ctrl.location = $stateParams.location;
				ctrl.imageUrl = _setImgUrl(ctrl.location);
			} else {
				// if user goes here via url, fetch data from server
				// need to use 'ng-if' in template to avoid accessing null
				locationService.get($stateParams.locationId)
					.then(function (response) {
						ctrl.location = response.data;
						ctrl.imageUrl = _setImgUrl(ctrl.location);
					})
					.catch(function(err){
						console.log(err);
					})
					;
			}

			ctrl.loading = false;	// whether show loading animation
		}

		// helper function only used inside controller
		function _setImgUrl(location) {
			return "http://maps.googleapis.com/maps/api/staticmap?center=" + location.coords[1] + "," + location.coords[0] + "&zoom=17&size=400x350&sensor=false&markers=" + location.coords[1] + "," + location.coords[0] + "&scale=2&key=AIzaSyDuC--sJusTOAOV-Gq6CBUiCS0VHJ6h5kM";
		}


		// two helper functions for displaying rating stars
		function getNumber(upper) {
			return new Array(upper);
		}

		function getNumberReverse(upper) {
			return new Array(5 - upper);
		}

		function onAddReview() {
			alert("Sorry, this feature is not yet completed :(");
		}

		function onDeleteReview(reviewId) {
			if (window.confirm("Are you sure to delete this review?")) {
				Review.delete({ locationId: ctrl.location._id, reviewId: reviewId }, function () {
					// re-fetch the location
					locationService.get($stateParams.locationId)
						.then(function (response) {
							ctrl.location = response.data;
							ctrl.imageUrl = _setImgUrl(ctrl.location);
						});
				});
			}
		}

		function onDelete() {
			if (!window.confirm("Are you sure to delete it?")) return;

			ctrl.loading = true;
			locationService.delete(ctrl.location._id)
				.then(function () {
					ctrl.loading = false;
					$state.go('locations');
				})
				.catch(function (err) {
					alert("Something wrong when deleting the location!");
					ctrl.loading = false;
				})
		}

		function onGoBack() {
			$state.go("locations");
		}
	}



})();