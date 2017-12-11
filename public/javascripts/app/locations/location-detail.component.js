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
		ctrl.toggleReviewPanel = toggleReviewPanel;


		function $onInit() {
			// if user clicks into here, we use the data from parent control
			if ($stateParams.location) {
				ctrl.location = $stateParams.location;
			} else {
				// if user goes here via url, fetch data from server
				// need to use 'ng-if' in template to avoid accessing null
				locationService.get($stateParams.locationId)
					.then(function (response) {
						ctrl.location = response.data;
					})
					.catch(function(err){
						console.log("not found!")
						// $state.go("404", undefined, {inherit: false, location: false});
						$state.go("404", {path: null}, {location: false})
					})
					;
			}

			ctrl.loading = false;	// whether show loading animation
			ctrl.showReviewPanel = false;
			ctrl.review = {};
			ctrl.ratings = [ 0,1,2,3,4,5 ];
			ctrl.locationId = $stateParams.locationId;

			$("html, body").animate({
				scrollTop: 0
			}, 500);
		}


		// two helper functions for displaying rating stars
		function getNumber(upper) {
			return new Array(Math.floor(upper));
		}

		function getNumberReverse(upper) {
			return new Array(5 - Math.floor(upper));
		}

		function onAddReview() {
			Review.save({locationId: ctrl.locationId}, ctrl.review, function(){
				window.location.reload(true)
			});
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
			$("html, body").animate({
				scrollTop: 0
			}, 300, "linear", function(){
				$state.go("locations");
			});
		}

		function toggleReviewPanel(){
			ctrl.showReviewPanel = !ctrl.showReviewPanel;
		}
	}



})();