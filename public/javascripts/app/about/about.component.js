(function(){


    angular.module('about', [])

    .component('about', {
        templateUrl: '/templates/about.html',
        controller: [AboutController],
        controllerAs: 'aboutCtrl'
    });

    function AboutController() {

    } 
})();