(function(){
	angular.module('loc8r', [
		'ui.router',
		'ngAnimate',
		'ngResource',
		// my modules
		'loading',
		'about',
		'constants',
		'locations',
		'templates',
		'statusPage'
	])
	.controller('MainCtrl', [function(){
		// once Angular.js is loaded, disable the loading animation
		$(".loading-index").css("display", "none");
	}]);
})();
