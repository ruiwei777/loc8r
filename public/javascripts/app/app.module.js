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
		'templates'
	])
	.controller('MainCtrl', [function(){}]);
})();
