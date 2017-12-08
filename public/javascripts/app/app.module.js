(function(){
	angular.module('loc8r', [
		'ui.router',
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
